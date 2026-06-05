import { LatLng } from "react-native-maps";
import { PlaceDetail } from "../../../../domain/models/PlaceDetail";
import { GooglePlacesUseCases } from "../../../../domain/useCases/googlePlaces/GooglePlacesUseCases";
import { ClientRequestUseCases } from "../../../../domain/useCases/clientRequest/ClientRequestUseCases";
import { TimeAndDistanceValues } from "../../../../domain/models/TimeAndDistanceValues";
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import { SocketService } from "../../../../data/sources/remote/services/SocketService";
import { ClientRequest } from "../../../../domain/models/ClientRequest";
import { DriverTripOfferUseCases } from "../../../../domain/useCases/driverTripOffer/DriverTripOfferUseCases";
import { DriverTripOffer } from "../../../../domain/models/DriverTripOffer";

export class ClientSerchMapViewModel {

    private googlePlacesUseCases: GooglePlacesUseCases;
    private clientRequestUseCases: ClientRequestUseCases;
    private driverTripOfferUseCases: DriverTripOfferUseCases;
    private socketService: SocketService;

    constructor(
        {
            googlePlacesUseCases, 
            clientRequestUseCases,
            socketService,
            driverTripOfferUseCases
        }: {
            googlePlacesUseCases: GooglePlacesUseCases,
            clientRequestUseCases: ClientRequestUseCases,
            socketService: SocketService,
            driverTripOfferUseCases: DriverTripOfferUseCases
        }
    ) {
        this.googlePlacesUseCases = googlePlacesUseCases;
        this.clientRequestUseCases = clientRequestUseCases;
        this.socketService = socketService;
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
    
    async createClientRequest(clientRequest: ClientRequest) {
        return await this.clientRequestUseCases.create.execute(clientRequest);
    }

    async updateDriverAssigned(idClientRequest: number, idDriver: number, fareAssigned: number) {
        return await this.clientRequestUseCases.updateDriverAssigned.execute(idClientRequest, idDriver, fareAssigned);
    }

    async getPlaceDetails(placeId: string): Promise<PlaceDetail | null> {
        return await this.googlePlacesUseCases.getPlaceDetails.execute(placeId);
    }

    async getDriverTripOffers(idClientRequest: number): Promise<DriverTripOffer[] | ErrorResponse> {
        return await this.driverTripOfferUseCases.getDriverTripOffers.execute(idClientRequest);
    }

    async getPlaceDetailsByCoords(lat: number, lng: number): Promise<PlaceGeocodeDetail | null> {
        return await this.googlePlacesUseCases.getPlaceDetailsByCoords.execute(lat, lng);
    }

    async getDirections(origin: LatLng, destination: LatLng): Promise<GoogleDirections | null> {
        return await this.googlePlacesUseCases.getDirections.execute(origin, destination);
    }

    async getTimeAndDistance(origin: LatLng, destination: LatLng): Promise<TimeAndDistanceValues | ErrorResponse> {
        return await this.clientRequestUseCases.getTimeAndDistance.execute(origin, destination);
    }

    emitNewDriverAssigned(idClientRequest: number, idDriver: number) {
        this.socketService.sendMessage('new_driver_assigned', {
            id_client_request: idClientRequest,
            id_driver: idDriver
        });
    }

    emitNewClientRequest(idClientRequest: number) {
        this.socketService.sendMessage('new_client_request', {
            id_client_request: idClientRequest
        });
    }

    listenerDriversPositionSocket(callback: (data: any) => void) {
        this.socketService.onMessage('new_driver_position', (data: any) => {
            // console.log('NUEVO CONDUCTOR', data);
            callback(data);
        })
    }

    listenerDriversDisconnectedSocket(callback: (idSocket: string) => void) {
        this.socketService.onMessage('driver_disconnected', (data: any) => {
            console.log('CONDUCTOR DESCONECTADO', data);
            const idSocket = data.id_socket;
            callback(idSocket);
        })
    }

    listenerNewDriverOffer(idClientRequest: number, callback: (data: any) => void) {
        this.socketService.onMessage(`created_driver_offer/${idClientRequest}`, (data: any) => {
            // console.log('NUEVO CONDUCTOR', data);
            callback(idClientRequest);
        })
    }

}