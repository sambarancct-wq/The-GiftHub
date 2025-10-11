package com.giftregistry.server.controller;

import com.giftregistry.server.model.RSVP;
import com.giftregistry.server.repository.RSVPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/rsvp")
@CrossOrigin(origins = "http://localhost:3000")
public class RSVPController {

    @Autowired
    private RSVPRepository rsvpRepository;

    /**
     * Submit RSVP response (from email link)
     */
    @PostMapping("/{rsvpId}/respond")
    public ResponseEntity<?> submitRSVP(@PathVariable Long rsvpId, @RequestParam String response) {
        try {
            Optional<RSVP> rsvpOptional = rsvpRepository.findById(rsvpId);
            if (rsvpOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "RSVP not found"));
            }

            RSVP rsvp = rsvpOptional.get();
            
            try {
                RSVP.RSVPStatus status = RSVP.RSVPStatus.valueOf(response.toUpperCase());
                rsvp.setStatus(status);
                rsvpRepository.save(rsvp);

                String message = status == RSVP.RSVPStatus.ACCEPTED ? 
                    "Thank you for confirming your attendance!" : 
                    "We're sorry you can't make it. Thanks for letting us know!";

                return ResponseEntity.ok(Map.of("message", message));

            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid response type"));
            }

        } catch (Exception e) {
            System.err.println("❌ Error submitting RSVP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error submitting RSVP"));
        }
    }

    /**
     * Get RSVP by ID (for email links)
     */
    @GetMapping("/{rsvpId}")
    public ResponseEntity<?> getRSVP(@PathVariable Long rsvpId) {
        try {
            Optional<RSVP> rsvp = rsvpRepository.findById(rsvpId);
            if (rsvp.isPresent()) {
                return ResponseEntity.ok(rsvp.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "RSVP not found"));
            }
        } catch (Exception e) {
            System.err.println("❌ Error fetching RSVP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching RSVP"));
        }
    }
}