package com.optic.apirest.services;

import com.google.firebase.messaging.*;
import com.optic.apirest.dto.notifications.PushNotificationRequest;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FirebaseMessagingService {

    public String sendPushNotification(PushNotificationRequest request) throws FirebaseMessagingException {
        Notification notification = Notification.builder()
                .setTitle(request.getTitle())
                .setBody(request.getBody())
                .build();
        Message message = Message.builder()
                .setToken(request.getToken())
                .putAllData(request.getData() != null ? request.getData() : Map.of())
                .setNotification(notification)
                .setAndroidConfig(AndroidConfig.builder()
                        .setPriority(AndroidConfig.Priority.HIGH)
                        .setTtl(60 * 1000 * 10) // 1 MINUTO
                        .build())
                .setApnsConfig(ApnsConfig.builder()
                        .putHeader("apns-priority", "5")
                        .putHeader("apns-expiration", "600")
                        .setAps(Aps.builder()
                                .setAlert(ApsAlert.builder()
                                        .setTitle(request.getTitle())
                                        .setBody(request.getBody())
                                        .build()
                                )
                                .setContentAvailable(true)
                                .build()
                        )
                        .build()
                )
                .build();
        return FirebaseMessaging.getInstance().send(message);
    }

}
