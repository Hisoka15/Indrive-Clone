import { LatLng } from "react-native-maps";
import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { GooglePlacesUseCases } from "../../../../domain/useCases/googlePlaces/GooglePlacesUseCases";
import { Status } from "../../../../domain/repository/ClientRequestRepository";

export class DriverTripMapViewModel {

    private clientRequestUseCases: ClientRequestUseCases;
    private socketService: SocketService;
    private googlePlacesUseCases: GooglePlacesUseCases;

    constructor(
        {
            clientRequestUseCases,
            socketService,
            googlePlacesUseCases
        }:
        {
            clientRequestUseCases: ClientRequestUseCases,
            socketService: SocketService,
            googlePlacesUseCases: GooglePlacesUseCases
        }
    ) {
        this.clientRequestUseCases = clientRequestUseCases;
        this.socketService = socketService;
        this.googlePlacesUseCases = googlePlacesUseCases;
    }

    initSocket() {
        if (!this.socketService.getSocket().connected) {
            this.socketService.getSocket().connect();
        }
        // this.socketService.onMessage('connect', () => {
        //     console.log('Conectado a SOCKET IO');
        // })
    }

    disconnectSocket() {
        this.socketService.disconnect();
    }

    async getClientRequestById(idClientRequest: number) {
        return await this.clientRequestUseCases.getClientRequestById.execute(idClientRequest);
    }

    async getDirections(origin: LatLng, destination: LatLng): Promise<GoogleDirections | null> {
        return await this.googlePlacesUseCases.getDirections.execute(origin, destination);
    }

    async updateStatus(idClientRequest: number, status: Status) {
        return await this.clientRequestUseCases.updateStatus.execute(idClientRequest, status);
    }

    emitDriverPosition(idClient: number, lat: number, lng: number) {
        this.socketService.sendMessage('trip_change_driver_position', {
            'id_client': idClient,
            'lat': lat,
            'lng': lng,
        });
    }

    emitUpdateStatus(idClientRequest: number, status: Status) {
        this.socketService.sendMessage('update_status_trip', {
            'id_client_request': idClientRequest,
            'status': status,
        });
    }

}