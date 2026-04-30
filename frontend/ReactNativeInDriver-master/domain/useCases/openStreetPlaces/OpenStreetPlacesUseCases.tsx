import { GetDirectionsUseCase } from "./GetDirectionsUseCase";
import { GetPlaceDetailsByCoordsUseCase } from "./GetPlaceDetailsByCoordsUseCase";
import { GetPlaceDetailsUseCase } from "./GetPlaceDetailsUseCase";

export class OpenStreetPlacesUseCases {
    getPlaceDetails: GetPlaceDetailsUseCase;
    getPlaceDetailsByCoords: GetPlaceDetailsByCoordsUseCase;
    getDirections: GetDirectionsUseCase;

    constructor(
        { getPlaceDetails, getPlaceDetailsByCoords, getDirections }:
            {
                getPlaceDetails: GetPlaceDetailsUseCase,
                getPlaceDetailsByCoords: GetPlaceDetailsByCoordsUseCase,
                getDirections: GetDirectionsUseCase
            }
    ) {
        this.getPlaceDetails = getPlaceDetails;
        this.getPlaceDetailsByCoords = getPlaceDetailsByCoords;
        this.getDirections = getDirections;
    }
}