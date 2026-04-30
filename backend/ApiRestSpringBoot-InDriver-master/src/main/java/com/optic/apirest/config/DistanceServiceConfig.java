package com.optic.apirest.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "distance")
public class DistanceServiceConfig {
    private String provider;
    private OsrmConfig osrm = new OsrmConfig();

    @Data
    public static class OsrmConfig {
        private String baseUrl = "https://router.project-osrm.org";
        private int timeout = 10000;
    }
}