import { LatLng } from "react-native-maps";
import { OpenStreetPlacesRepository } from "../../repository/OpenStreetPlacesRepository";
import { OSMRouteResponse } from "../../../data/sources/remote/services/OpenStreetMapService";

export class GetDirectionsUseCase {
    private openStreetPlacesRepository: OpenStreetPlacesRepository;

    constructor({ openStreetPlacesRepository }: { openStreetPlacesRepository: OpenStreetPlacesRepository }) {
        this.openStreetPlacesRepository = openStreetPlacesRepository;
    }

    async execute(origin: LatLng, destination: LatLng): Promise<OSMRouteResponse | null> {
        return await this.openStreetPlacesRepository.getDirections(origin, destination);
    }
}