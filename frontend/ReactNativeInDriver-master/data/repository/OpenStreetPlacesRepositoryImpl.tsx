import { LatLng } from "react-native-maps";
import { OpenStreetPlacesRepository } from "../../domain/repository/OpenStreetPlacesRepository";
import { OpenStreetPlacesService } from "../sources/remote/services/OpenStreetPlacesService";
import { OpenStreetPlaceDetail, OSMRouteResponse } from "../sources/remote/services/OpenStreetMapService";

export class OpenStreetPlacesRepositoryImpl implements OpenStreetPlacesRepository {

    private openStreetPlacesService: OpenStreetPlacesService;

    constructor(
        { openStreetPlacesService }: { openStreetPlacesService: OpenStreetPlacesService }
    ) {
        this.openStreetPlacesService = openStreetPlacesService;
    }

    async getDirections(origin: LatLng, destination: LatLng): Promise<OSMRouteResponse | null> {
        return this.openStreetPlacesService.getDirections(origin, destination);
    }

    async getPlaceDetailsByCoords(lat: number, lng: number): Promise<OpenStreetPlaceDetail | null> {
        return this.openStreetPlacesService.getPlaceDetailsByCoords(lat, lng);
    }

    async getPlaceDetails(query: string): Promise<OpenStreetPlaceDetail[]> {
        return this.openStreetPlacesService.getPlaceDetails(query);
    }
}