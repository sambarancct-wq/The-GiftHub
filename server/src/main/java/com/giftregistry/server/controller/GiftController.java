package com.giftregistry.server.controller;

import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.Gift;
import com.giftregistry.server.repository.EventRepository;
import com.giftregistry.server.repository.GiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    private static final String UPLOAD_DIR = "uploads/";

    /**
     * Add Gift (Multipart Upload)
     */
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addGift(
            @RequestParam("name") String name,
            @RequestParam("recipient") String recipient,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "eventId", required = false) Long eventId
    ) {
        try {
            //Validation
            if (name.trim().isEmpty() || recipient.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name and recipient are required"));
            }
            if (price.compareTo(BigDecimal.ZERO) < 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Price must be positive"));
            }

            // Save image file if provided
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) uploadDir.mkdirs();

                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                File dest = new File(uploadDir, fileName);
                image.transferTo(dest);
                imageUrl = "/uploads/" + fileName; // stored path (can serve statically)
            }

            // Link event if provided
            Event event = null;
            if (eventId != null) {
                event = eventRepository.findById(eventId).orElse(null);
                if (event == null)
                    return ResponseEntity.badRequest().body(Map.of("message", "Invalid Event ID"));
            }

            //Create and save gift
            Gift gift = new Gift();
            gift.setName(name);
            gift.setRecipient(recipient);
            gift.setNotes(notes);
            gift.setPrice(price);
            gift.setImage(imageUrl);
            gift.setEvent(event);
            gift.setCreatedAt(LocalDateTime.now());
            gift.setUpdatedAt(LocalDateTime.now());

            Gift savedGift = giftRepository.save(gift);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "🎁 Gift added successfully!",
                    "gift", savedGift
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "File upload error"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get All Gifts
     */
    @GetMapping
    public ResponseEntity<?> getAllGifts() {
        try {
            return ResponseEntity.ok(giftRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error fetching gifts"));
        }
    }

    /**
     * Get Gift by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getGiftById(@PathVariable Long id) {
        Optional<Gift> gift = giftRepository.findById(id);
        return gift.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Gift not found")));
    }

    /**
     * Update Gift (Multipart Support)
     */
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateGift(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "recipient", required = false) String recipient,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "status", required = false) Gift.GiftStatus status
    ) {
        try {
            Optional<Gift> existingGift = giftRepository.findById(id);
            if (existingGift.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Gift not found"));
            }

            Gift gift = existingGift.get();

            if (name != null) gift.setName(name);
            if (recipient != null) gift.setRecipient(recipient);
            if (notes != null) gift.setNotes(notes);
            if (price != null) gift.setPrice(price);
            if (status != null) gift.setStatus(status);

            if (image != null && !image.isEmpty()) {
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) uploadDir.mkdirs();

                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                File dest = new File(uploadDir, fileName);
                image.transferTo(dest);
                gift.setImage("/uploads/" + fileName);
            }

            gift.setUpdatedAt(LocalDateTime.now());
            Gift updatedGift = giftRepository.save(gift);

            return ResponseEntity.ok(Map.of(
                    "message", "Gift updated successfully!",
                    "gift", updatedGift
            ));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error uploading image"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error updating gift"));
        }
    }

    /**
     * Delete Gift
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGift(@PathVariable Long id) {
        if (!giftRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Gift not found"));
        }
        giftRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Gift deleted successfully"));
    }
}
