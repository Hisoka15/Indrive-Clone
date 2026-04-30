import { LatLng } from "react-native-maps";
import { OpenStreetPlaceDetail, OSMRouteResponse } from "../../data/sources/remote/services/OpenStreetMapService";

export interface OpenStreetPlacesRepository {
    getPlaceDetails(query: string): Promise<OpenStreetPlaceDetail[]>;
    getPlaceDetailsByCoords(lat: number, lng: number): Promise<OpenStreetPlaceDetail | null>;
    getDirections(origin: LatLng, destination: LatLng): Promise<OSMRouteResponse | null>;
}