package com.optic.apirest.services;

import com.optic.apirest.dto.client_request.*;
import com.optic.apirest.models.TimeAndDistanceValues;
import com.optic.apirest.repositories.ClientRequestRepository;
import com.optic.apirest.repositories.TimeAndDistanceValuesRepository;
import com.optic.apirest.services.distance.DistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientRequestService {

    @Autowired
    private TimeAndDistanceValuesRepository timeAndDistanceValuesRepository;

    @Autowired
    private ClientRequestRepository clientRequestRepository;

    @Autowired
    private DistanceService distanceService;

    public Long create(ClientRequestDTO clientRequest) {
        return clientRequestRepository.insertClientRequest(
                clientRequest.getIdClient(),
                clientRequest.getFareOffered(),
                clientRequest.getPickupLat(),
                clientRequest.getPickupLng(),
                clientRequest.getDestinationLat(),
                clientRequest.getDestinationLng(),
                clientRequest.getPickupDescription(),
                clientRequest.getDestinationDescription()
        );
    }

    public DistanceMatrixResponse getTimeAndDistance(double originLat, double originLng,
                                                     double destinationLat, double destinationLng) {

        TimeAndDistanceValues values = timeAndDistanceValuesRepository.findById(1L).orElseThrow(
                () -> new RuntimeException("Los precios no han sido establecidos")
        );

        DistanceMatrixResponse responseDTO = distanceService.calculateDistance(
                originLat, originLng, destinationLat, destinationLng
        );

        double km = responseDTO.getDistance().getValue() / 1000;
        double minutes = responseDTO.getDuration().getValue() / 60;
        double recommendedValue = values.getKmValue() * km + values.getMinValue() * minutes;

        responseDTO.setRecommendedValue(recommendedValue);

        return responseDTO;
    }

    public List<NearbyClientRequestResponse> findNearbyClientRequest(double driverLat, double driverLng) {
        return clientRequestRepository.findNearbyClientRequest(driverLat, driverLng);
    }

    public List<ClientRequestResponse> getByClientAssigned(Long idClient) {
        return clientRequestRepository.getByClientAssigned(idClient);
    }

    public List<ClientRequestResponse> getByDriverAssigned(Long idDriverAssigned) {
        return clientRequestRepository.getByDriverAssigned(idDriverAssigned);
    }

    public ClientRequestResponse getByClientRequest(Long id) {
        return clientRequestRepository.getByClientRequest(id);
    }

    public boolean updateDriverAssigned(AssignDriverRequestDTO request) {
        return clientRequestRepository.updateDriverAssigned(request);
    }

    public boolean updateStatus(UpdateStatusClientRequestDTO request) {
        return clientRequestRepository.updateStatus(request);
    }

    public boolean updateClientRating(UpdateClientRatingDTO request) {
        return clientRequestRepository.updateClientRating(request);
    }

    public boolean updateDriverRating(UpdateDriverRatingDTO request) {
        return clientRequestRepository.updateDriverRating(request);
    }
}