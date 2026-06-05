package com.optic.apirest.controllers;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.optic.apirest.dto.notifications.PushNotificationRequest;
import com.optic.apirest.dto.user.NotificationTokenRequest;
import com.optic.apirest.services.FirebaseMessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/firebase-notification")
public class FirebaseMessagingController {

    @Autowired
    private FirebaseMessagingService firebaseMessagingService;

    @PostMapping(value = "/send/notification")
    public ResponseEntity<?> sendNotification(@RequestBody PushNotificationRequest request) {
        try {
            String response = firebaseMessagingService.sendPushNotification(request);
            return ResponseEntity.ok("Notificacion enviada: " + response);
        } catch (FirebaseMessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", e.getMessage(),
                    "statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value()
            ));
        }
    }

}
