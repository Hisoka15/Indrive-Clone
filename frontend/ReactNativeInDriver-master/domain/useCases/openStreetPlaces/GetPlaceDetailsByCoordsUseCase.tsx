import { OpenStreetPlacesRepository } from "../../repository/OpenStreetPlacesRepository";
import { OpenStreetPlaceDetail } from "../../../data/sources/remote/services/OpenStreetMapService";

export class GetPlaceDetailsByCoordsUseCase {
    private openStreetPlacesRepository: OpenStreetPlacesRepository;

    constructor({ openStreetPlacesRepository }: { openStreetPlacesRepository: OpenStreetPlacesRepository }) {
        this.openStreetPlacesRepository = openStreetPlacesRepository;
    }

    async execute(lat: number, lng: number): Promise<OpenStreetPlaceDetail | null> {
        return await this.openStreetPlacesRepository.getPlaceDetailsByCoords(lat, lng);
    }
}