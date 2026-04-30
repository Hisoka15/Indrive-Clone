import { OpenStreetPlacesRepository } from "../../repository/OpenStreetPlacesRepository";
import { OpenStreetPlaceDetail } from "../../../data/sources/remote/services/OpenStreetMapService";

export class GetPlaceDetailsUseCase {
    private openStreetPlacesRepository: OpenStreetPlacesRepository;

    constructor({ openStreetPlacesRepository }: { openStreetPlacesRepository: OpenStreetPlacesRepository }) {
        this.openStreetPlacesRepository = openStreetPlacesRepository;
    }

    async execute(query: string): Promise<OpenStreetPlaceDetail[]> {
        return await this.openStreetPlacesRepository.getPlaceDetails(query);
    }
}