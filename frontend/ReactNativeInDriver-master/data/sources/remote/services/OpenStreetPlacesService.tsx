import { LatLng } from "react-native-maps";
import { OpenStreetMapService, OSMRouteResponse, OpenStreetPlaceDetail } from "./OpenStreetMapService";

const osmService = new OpenStreetMapService();

export class OpenStreetPlacesService {

    async getPlaceDetails(query: string): Promise<OpenStreetPlaceDetail[]> {
        return osmService.getPlaceDetails(query);
    }

    async getPlaceDetailsByCoords(lat: number, lng: number): Promise<OpenStreetPlaceDetail | null> {
        return osmService.getPlaceDetailsByCoords(lat, lng);
    }

    async getDirections(origin: LatLng, destination: LatLng): Promise<OSMRouteResponse | null> {
        return osmService.getDirections(origin, destination);
    }
}