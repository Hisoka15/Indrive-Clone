package com.optic.apirest.socket;

import com.corundumstudio.socketio.SocketIOServer;
import com.optic.apirest.dto.socket.*;
import org.springframework.stereotype.Component;

@Component
public class SocketEventHandler {

    public SocketEventHandler(SocketIOServer server) {
        server.addConnectListener(client -> System.out.println("Cliente Conectado: " + client.getSessionId()));

        server.addDisconnectListener(client -> {
            System.out.println("Cliente Desconectado: " + client.getSessionId());
            SocketIdResponse response = new SocketIdResponse();
            response.setIdSocket(client.getSessionId().toString());
            server.getBroadcastOperations().sendEvent("driver_disconnected", response);
        });

        server.addEventListener("message", MessageDTO.class, (client, data, ackSender) -> {
            System.out.println("Mensaje recibido: " + data.getNewMessage());
            server.getBroadcastOperations().sendEvent("new_message_response", "Hola desde el servidor " + data.getNewMessage());
        });

        server.addEventListener("change_driver_position", DriverPositionDTO.class, (client, data, ackSender) -> {
            System.out.println("Cambio posicion del conductor: " + data.getLat() + ", " + data.getLng());
            DriverPositionDTO position = new DriverPositionDTO();
            position.setIdSocket(client.getSessionId().toString());
            position.setId(data.getId());
            position.setLat(data.getLat());
            position.setLng(data.getLng());

            server.getBroadcastOperations().sendEvent("new_driver_position", position);
        });

        server.addEventListener("new_client_request", NewClientRequestDTO.class, (client, data, ackSender) -> {

            NewClientRequestDTO newClientRequestDTO = new NewClientRequestDTO();
            newClientRequestDTO.setIdClientRequest(data.getIdClientRequest());
            newClientRequestDTO.setIdSocket(client.getSessionId().toString());

            server.getBroadcastOperations().sendEvent("created_client_request", newClientRequestDTO);
        });

        server.addEventListener("new_driver_offer", NewDriverOfferDTO.class, (client, data, ackSender) -> {

            NewDriverOfferDTO newDriverOfferDTO = new NewDriverOfferDTO();
            newDriverOfferDTO.setIdClientRequest(data.getIdClientRequest());
            newDriverOfferDTO.setIdSocket(client.getSessionId().toString());

            server.getBroadcastOperations().sendEvent("created_driver_offer/" + data.getIdClientRequest(), newDriverOfferDTO);
        });

        server.addEventListener("new_driver_assigned", NewDriverAssignedDTO.class, (client, data, ackSender) -> {

            NewDriverAssignedDTO newDriverAssignedDTO = new NewDriverAssignedDTO();
            newDriverAssignedDTO.setIdClientRequest(data.getIdClientRequest());
            newDriverAssignedDTO.setIdSocket(client.getSessionId().toString());

            server.getBroadcastOperations().sendEvent("driver_assigned/" + data.getIdDriver(), newDriverAssignedDTO);
        });

        server.addEventListener("trip_change_driver_position", TripChangeDriverPositionDTO.class, (client, data, ackSender) -> {

            TripChangeDriverPositionDTO dto = new TripChangeDriverPositionDTO();
            dto.setLat(data.getLat());
            dto.setLng(data.getLng());
            dto.setIdSocket(client.getSessionId().toString());

            server.getBroadcastOperations().sendEvent("trip_new_driver_position/" + data.getIdClient(), dto);
        });

        server.addEventListener("update_status_trip", UpdateStatusTripDTO.class, (client, data, ackSender) -> {

            UpdateStatusTripDTO dto = new UpdateStatusTripDTO();
            dto.setIdClientRequest(data.getIdClientRequest());
            dto.setStatus(data.getStatus());
            dto.setIdSocket(client.getSessionId().toString());

            server.getBroadcastOperations().sendEvent("new_status_trip/" + data.getIdClientRequest(), dto);
        });


    }

}
