package com.giftregistry.server.controller;

import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.Gift;
import com.giftregistry.server.repository.EventRepository;
import com.giftregistry.server.repository.GiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/gifts")
@CrossOrigin(origins = "http://localhost:3000")
public class GiftController {

    @Autowired
    private GiftRepository giftRepository;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping
    public ResponseEntity<?> addGift(@RequestBody Gift gift) {
        try {
            String name = gift.getName();
            String recipient = gift.getRecipient();
            BigDecimal price = gift.getPrice();

            if (name == null || recipient == null || price == null || 
                name.trim().isEmpty() || recipient.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Name, recipient and price are necessary");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate price is positive
            if (price.compareTo(BigDecimal.ZERO) < 0) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Price must be a positive number");
                return ResponseEntity.badRequest().body(response);
            }

            // If event is provided, validate it exists
            if (gift.getEvent() != null && gift.getEvent().getId() != null) {
                Optional<Event> event = eventRepository.findById(gift.getEvent().getId());
                if (!event.isPresent()) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Event not found");
                    return ResponseEntity.badRequest().body(response);
                }
                gift.setEvent(event.get());
            }

            Gift savedGift = giftRepository.save(gift);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Gift Added Successfully!!");
            response.put("gift", savedGift);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Additional CRUD operations
    @GetMapping
    public ResponseEntity<?> getAllGifts() {
        try {
            return ResponseEntity.ok(giftRepository.findAll());
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving gifts");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGiftById(@PathVariable Long id) {
        try {
            Optional<Gift> gift = giftRepository.findById(id);
            if (gift.isPresent()) {
                return ResponseEntity.ok(gift.get());
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Gift not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving gift");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGift(@PathVariable Long id, @RequestBody Gift giftDetails) {
        try {
            Optional<Gift> giftOptional = giftRepository.findById(id);
            if (!giftOptional.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Gift not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Gift gift = giftOptional.get();
            
            // Update fields
            if (giftDetails.getName() != null) gift.setName(giftDetails.getName());
            if (giftDetails.getRecipient() != null) gift.setRecipient(giftDetails.getRecipient());
            if (giftDetails.getNotes() != null) gift.setNotes(giftDetails.getNotes());
            if (giftDetails.getPrice() != null) gift.setPrice(giftDetails.getPrice());
            if (giftDetails.getImage() != null) gift.setImage(giftDetails.getImage());
            if (giftDetails.getStatus() != null) gift.setStatus(giftDetails.getStatus());
            if (giftDetails.getEvent() != null) gift.setEvent(giftDetails.getEvent());

            Gift updatedGift = giftRepository.save(gift);
            return ResponseEntity.ok(updatedGift);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating gift");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGift(@PathVariable Long id) {
        try {
            if (giftRepository.existsById(id)) {
                giftRepository.deleteById(id);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Gift deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Gift not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting gift");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}