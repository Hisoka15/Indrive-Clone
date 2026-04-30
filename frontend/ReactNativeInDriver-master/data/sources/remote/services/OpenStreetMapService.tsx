import { LatLng } from "react-native-maps";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const OSRM_BASE_URL = "https://router.project-osrm.org";

export interface OpenStreetPlaceDetail {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
    address: {
        road?: string;
        suburb?: string;
        city?: string;
        state?: string;
        country?: string;
    };
}

export interface OSMRouteResponse {
    code: string;
    routes: {
        distance: number;
        duration: number;
        legs: {
            distance: number;
            duration: number;
            steps: {
                distance: number;
                duration: number;
                name: string;
                instruction: string;
            }[];
        }[];
    }[];
}

export class OpenStreetMapService {

    async getPlaceDetails(query: string): Promise<OpenStreetPlaceDetail[]> {
        try {
            const url = `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=es`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'RideHailingApp/1.0'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error en Nominatim search:', error);
            return [];
        }
    }

    async getPlaceDetailsByCoords(lat: number, lng: number): Promise<OpenStreetPlaceDetail | null> {
        try {
            const url = `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'RideHailingApp/1.0'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error en Nominatim reverse:', error);
            return null;
        }
    }

    async getDirections(origin: LatLng, destination: LatLng): Promise<OSMRouteResponse | null> {
        try {
            const url = `${OSRM_BASE_URL}/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=false&steps=true`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error en OSRM directions:', error);
            return null;
        }
    }
}