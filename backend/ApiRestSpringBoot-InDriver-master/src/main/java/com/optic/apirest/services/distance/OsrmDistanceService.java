package com.optic.apirest.services.distance;

import com.fasterxml.jackson.databind.JsonNode;
import com.optic.apirest.config.DistanceServiceConfig;
import com.optic.apirest.dto.client_request.DistanceMatrixResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class OsrmDistanceService implements DistanceService {

    private final DistanceServiceConfig config;
    private final RestTemplate restTemplate;

    @Override
    public DistanceMatrixResponse calculateDistance(double originLat, double originLng,
                                                    double destLat, double destLng) {
        try {
            String url = config.getOsrm().getBaseUrl() +
                    "/route/v1/driving/" +
                    originLng + "," + originLat + ";" +
                    destLng + "," + destLat +
                    "?overview=false";

            ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);

            if (response.getBody() == null || !response.getBody().has("routes")) {
                throw new RuntimeException("Empty response from OSRM");
            }

            JsonNode route = response.getBody().get("routes").get(0);
            double distanceMeters = route.get("distance").asDouble();
            double durationSeconds = route.get("duration").asDouble();

            DistanceMatrixResponse result = new DistanceMatrixResponse();
            result.setOriginAddresses(String.format("%.6f, %.6f", originLat, originLng));
            result.setDestinationAddresses(String.format("%.6f, %.6f", destLat, destLng));

            DistanceMatrixResponse.Distance distance = new DistanceMatrixResponse.Distance();
            distance.setValue(distanceMeters);
            distance.setText(formatDistance(distanceMeters));

            DistanceMatrixResponse.Duration duration = new DistanceMatrixResponse.Duration();
            duration.setValue(durationSeconds);
            duration.setText(formatDuration(durationSeconds));

            result.setDistance(distance);
            result.setDuration(duration);

            return result;

        } catch (Exception e) {
            log.error("Error calling OSRM: {}", e.getMessage());
            throw new RuntimeException("Failed to calculate distance", e);
        }
    }

    private String formatDistance(double meters) {
        if (meters >= 1000) {
            return String.format("%.1f km", meters / 1000);
        }
        return String.format("%.0f m", meters);
    }

    private String formatDuration(double seconds) {
        if (seconds >= 3600) {
            long hours = (long) (seconds / 3600);
            long minutes = (long) ((seconds % 3600) / 60);
            return String.format("%d h %d min", hours, minutes);
        }
        return String.format("%.0f min", seconds / 60);
    }
}