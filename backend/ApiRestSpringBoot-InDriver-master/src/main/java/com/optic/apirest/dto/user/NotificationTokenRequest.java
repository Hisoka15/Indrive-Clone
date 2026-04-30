package com.optic.apirest.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class NotificationTokenRequest {

    @JsonProperty("notification_token")
    private String notificationToken;

}
