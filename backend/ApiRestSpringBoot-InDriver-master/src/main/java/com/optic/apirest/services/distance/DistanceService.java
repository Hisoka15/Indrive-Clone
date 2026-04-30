package com.optic.apirest.services.distance;

import com.optic.apirest.dto.client_request.DistanceMatrixResponse;

public interface DistanceService {
    DistanceMatrixResponse calculateDistance(double originLat, double originLng,
                                             double destLat, double destLng);
}