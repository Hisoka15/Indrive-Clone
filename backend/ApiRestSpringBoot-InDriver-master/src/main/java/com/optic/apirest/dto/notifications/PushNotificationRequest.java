package com.optic.apirest.dto.notifications;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PushNotificationRequest {

    private String token;
    private String title;
    private String body;
    private Map<String, String> data;

}
