package com.giftregistry.server.service;

import com.giftregistry.server.model.Event;

public interface EmailService {
    void sendEventCreationEmail(String toEmail, Event event);
    void sendRSVPInvitation(String toEmail, Event event, Long rsvpId);
}