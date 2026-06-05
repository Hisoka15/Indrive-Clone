import { Socket } from "socket.io-client";
import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { GooglePlacesUseCases } from "../../../../domain/useCases/googlePlaces/GooglePlacesUseCases";
import LoginScreen from "../../auth/login/LoginScreen";
import { DriverPosition } from "../../../../domain/models/DriverPosition";
import { DriverPositionUseCases } from "../../../../domain/useCases/driverPosition/DriverPositionUseCases";
import { LatLng } from "react-native-maps";
import { DriverTripOffer } from "../../../../domain/models/DriverTripOffer";
import { DriverTripOfferUseCases } from "../../../../domain/useCases/driverTripOffer/DriverTripOfferUseCases";

export class DriverMyLocationMapViewModel {

    private googlePlacesUseCases: GooglePlacesUseCases;
    private clientRequestUseCases: ClientRequestUseCases;
    private driverPositionUseCases: DriverPositionUseCases;
    private socketService: SocketService;
    private driverTripOfferUseCases: DriverTripOfferUseCases;
    

    constructor(
        {
            googlePlacesUseCases, 
            clientRequestUseCases,
            socketService,
            driverPositionUseCases,
            driverTripOfferUseCases
        }: {
            googlePlacesUseCases: GooglePlacesUseCases,
            clientRequestUseCases: ClientRequestUseCases,
            socketService: SocketService,
            driverPositionUseCases: DriverPositionUseCases,
            driverTripOfferUseCases: DriverTripOfferUseCases,
        }
    ) {
        this.googlePlacesUseCases = googlePlacesUseCases;
        this.clientRequestUseCases = clientRequestUseCases;
        this.socketService = socketService;
        this.driverPositionUseCases = driverPositionUseCases,
        this.driverTripOfferUseCases = driverTripOfferUseCases;
    }

    initSocket() {
        if (!this.socketService.getSocket().connected) {
            this.socketService.getSocket().connect();
        }
        // this.socketService.onMessage('connect', () => {
        //     console.log('Conectado a SOCKET IO');
        // })
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