import { Socket } from "socket.io-client";
import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { OpenStreetPlacesUseCases } from "../../../../domain/useCases/openStreetPlaces/OpenStreetPlacesUseCases";
import LoginScreen from "../../auth/login/LoginScreen";
import { DriverPosition } from "../../../../domain/models/DriverPosition";
import { DriverPositionUseCases } from "../../../../domain/useCases/driverPosition/DriverPositionUseCases";
import { LatLng } from "react-native-maps";
import { DriverTripOffer } from "../../../../domain/models/DriverTripOffer";
import { DriverTripOfferUseCases } from "../../../../domain/useCases/driverTripOffer/DriverTripOfferUseCases";

export class DriverMyLocationMapViewModel {

    private openStreetPlacesUseCases: OpenStreetPlacesUseCases;
    private clientRequestUseCases: ClientRequestUseCases;
    private driverPositionUseCases: DriverPositionUseCases;
    private socketService: SocketService;
    private driverTripOfferUseCases: DriverTripOfferUseCases;


    constructor(
        {
            openStreetPlacesUseCases,
            clientRequestUseCases,
            socketService,
            driverPositionUseCases,
            driverTripOfferUseCases
        }: {
            openStreetPlacesUseCases: OpenStreetPlacesUseCases,
            clientRequestUseCases: ClientRequestUseCases,
            socketService: SocketService,
            driverPositionUseCases: DriverPositionUseCases,
            driverTripOfferUseCases: DriverTripOfferUseCases,
        }
    ) {
        this.openStreetPlacesUseCases = openStreetPlacesUseCases;
        this.clientRequestUseCases = clientRequestUseCases;
        this.socketService = socketService;
        this.driverPositionUseCases = driverPositionUseCases,
            this.driverTripOfferUseCases = driverTripOfferUseCases;
    }

    initSocket() {
        if (!this.socketService.getSocket().connected) {
            this.socketService.getSocket().connect();
        }
    }

    emitDriverPosition(id: number, lat: number, lng: number) {
        this.socketService.sendMessage('change_driver_position', {
            'id': id,
            'lat': lat,
            'lng': lng,
        });
    }

    disconnectSocket() {
        this.socketService.disconnect();
    }

    async createDriverPosition(driverPosition: DriverPosition) {
        return await this.driverPositionUseCases.create.execute(driverPosition);
    }

    async getNearbyTripRequest(driverPosition: LatLng) {
        return this.clientRequestUseCases.getNearbyTripRequest.execute(driverPosition);
    }

    async getDriverPosition(idDriver: number) {
        return await this.driverPositionUseCases.getDriverPosition.execute(idDriver);
    }

    async createDriverTripOffer(driverTripOffer: DriverTripOffer) {
        return await this.driverTripOfferUseCases.create.execute(driverTripOffer);
    }

    listenerNewDriverAssignedSocket(idDriver: number, callback: (data: any) => void) {
        this.socketService.onMessage(`driver_assigned/${idDriver}`, (data: any) => {
            callback(data);
        });
    }

    listenerNewClientRequestSocket(callback: (data: any) => void) {
        this.socketService.onMessage('created_client_request', (data: any) => {
            callback(data);
        });
    }

    emitNewDriverOffer(idClientRequest: number) {
        this.socketService.sendMessage('new_driver_offer', {
            'id_client_request': idClientRequest
        });
    }

}