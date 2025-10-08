package com.giftregistry.server.controller;

import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.Gift;
import com.giftregistry.server.repository.EventRepository;
import com.giftregistry.server.repository.GiftRepository;
import com.giftregistry.server.service.ImageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired
    private ImageService imageService;

    /**
     * Add Gift with Cloudinary Image Upload
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
            // Validation
            if (name == null || name.trim().isEmpty() || recipient == null || recipient.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name and recipient are required"));
            }
            if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Price must be positive"));
            }

            // Upload image to Cloudinary
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                try {
                    imageUrl = imageService.uploadImage(image);
                    System.out.println("✅ Image uploaded to Cloudinary: " + imageUrl);
                } catch (Exception e) {
                    System.err.println("❌ Image upload failed: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("message", "Image upload failed: " + e.getMessage()));
                }
            }

            // Link event if provided
            Event event = null;
            if (eventId != null) {
                Optional<Event> eventOpt = eventRepository.findById(eventId);
                if (eventOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Invalid Event ID"));
                }
                event = eventOpt.get();
            }

            // Create and save gift
            Gift gift = new Gift();
            gift.setName(name.trim());
            gift.setRecipient(recipient.trim());
            gift.setNotes(notes != null ? notes.trim() : null);
            gift.setPrice(price);
            gift.setImage(imageUrl); // Store Cloudinary URL
            gift.setEvent(event);
            gift.setCreatedAt(LocalDateTime.now());
            gift.setUpdatedAt(LocalDateTime.now());

            Gift savedGift = giftRepository.save(gift);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "🎁 Gift added successfully!");
            response.put("gift", savedGift);
            if (imageUrl != null) {
                response.put("imageUrl", imageUrl);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.err.println("❌ Error adding gift: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error adding gift: " + e.getMessage()));
        }
    }

    /**
     * Update Gift with Cloudinary
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

            // Update fields if provided
            if (name != null) gift.setName(name.trim());
            if (recipient != null) gift.setRecipient(recipient.trim());
            if (notes != null) gift.setNotes(notes.trim());
            if (price != null) gift.setPrice(price);
            if (status != null) gift.setStatus(status);

            // Handle image update
            if (image != null && !image.isEmpty()) {
                // Delete old image from Cloudinary if exists
                if (gift.getImage() != null) {
                    imageService.deleteImage(gift.getImage());
                }
                
                // Upload new image
                String newImageUrl = imageService.uploadImage(image);
                gift.setImage(newImageUrl);
            }

            gift.setUpdatedAt(LocalDateTime.now());
            Gift updatedGift = giftRepository.save(gift);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Gift updated successfully!");
            response.put("gift", updatedGift);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error updating gift: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating gift: " + e.getMessage()));
        }
    }

    /**
     * Delete Gift (also deletes image from Cloudinary)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGift(@PathVariable Long id) {
        try {
            Optional<Gift> gift = giftRepository.findById(id);
            if (gift.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Gift not found"));
            }

            // Delete image from Cloudinary if exists
            if (gift.get().getImage() != null) {
                imageService.deleteImage(gift.get().getImage());
            }

            giftRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Gift deleted successfully"));

        } catch (Exception e) {
            System.err.println("❌ Error deleting gift: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting gift"));
        }
    }

    // Keep your existing GET methods (they don't need changes)
    @GetMapping
    public ResponseEntity<?> getAllGifts() {
        try {
            return ResponseEntity.ok(giftRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error fetching gifts"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGiftById(@PathVariable Long id) {
        Optional<Gift> gift = giftRepository.findById(id);
        return gift.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Gift not found")));
    }
}