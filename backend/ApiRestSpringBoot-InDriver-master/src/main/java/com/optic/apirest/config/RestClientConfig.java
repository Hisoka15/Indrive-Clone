package com.optic.apirest.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestClientConfig {

    @Bean
    public RestTemplate restTemplate(DistanceServiceConfig config) {
        return new RestTemplateBuilder()
                .connectTimeout(Duration.ofMillis(config.getOsrm().getTimeout()))
                .readTimeout(Duration.ofMillis(config.getOsrm().getTimeout()))
                .build();
    }
}