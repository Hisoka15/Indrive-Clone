import { LatLng } from "react-native-maps";
import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { GooglePlacesUseCases } from "../../../../domain/useCases/googlePlaces/GooglePlacesUseCases";

export class ClientTripMapViewModel {

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

    async getClientRequestById(idClientRequest: number) {
        return await this.clientRequestUseCases.getClientRequestById.execute(idClientRequest);
    }

    async getDirections(origin: LatLng, destination: LatLng): Promise<GoogleDirections | null> {
        return await this.googlePlacesUseCases.getDirections.execute(origin, destination);
    }

    listenerDriversPositionSocket(idClient: number, callback: (data: any) => void) {
        this.socketService.onMessage(`trip_new_driver_position/${idClient}`, (data: any) => {
            callback(data);
        })
    }

    listenerUpdateStatusSocket(idClientRequest: number, callback: (data: any) => void) {
        this.socketService.onMessage(`new_status_trip/${idClientRequest}`, (data: any) => {
            callback(data);
        })
    }

}