package com.giftregistry.server.controller;

import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.Gift;
import com.giftregistry.server.model.User;
import com.giftregistry.server.repository.EventRepository;
import com.giftregistry.server.repository.GiftRepository;
import com.giftregistry.server.service.ImageService;
import com.giftregistry.server.dto.GiftDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
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

    private GiftDTO mapGiftToDTO(Gift gift) {
        GiftDTO dto = new GiftDTO();
        dto.setId(gift.getId());
        dto.setName(gift.getName());
        dto.setRecipient(gift.getRecipient());
        dto.setPrice(gift.getPrice());
        dto.setImage(gift.getImage());
        dto.setProductUrl(gift.getProductUrl());
        dto.setDescription(gift.getDescription());
        dto.setStore(gift.getStore());
        dto.setStatus(gift.getStatus() != null ? gift.getStatus().name() : null);
        dto.setCreatedAt(gift.getCreatedAt());
        dto.setUpdatedAt(gift.getUpdatedAt());
        dto.setPlannedById(gift.getPlannedBy() != null ? gift.getPlannedBy().getId() : null);
        return dto;
    }

    /**
     * Add Gift with Cloudinary Image Upload
     */
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addGift(
            @RequestParam("name") String name,
            @RequestParam("recipient") String recipient,
            @RequestParam("price") BigDecimal price,
            @RequestParam("eventId") Long eventId,
            @RequestParam("plannedBy") Long plannedById, // ID of the user planning this gift
            @RequestParam(value = "productUrl", required = false) String productUrl,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "store") String store,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "imageUrl", required = false) String imageUrl
    ) {
        try {
            Optional<Event> event = eventRepository.findById(eventId);
            if (!event.isPresent())
                return ResponseEntity.badRequest().body(Map.of("message", "Event not found"));
            Gift gift = new Gift();
            gift.setName(name.trim());
            gift.setRecipient(recipient.trim());
            gift.setPrice(price);
            gift.setEvent(event.get());
            gift.setPlannedBy(new User(plannedById)); // assumes (Long id) constructor
            gift.setProductUrl(productUrl);
            gift.setDescription(description != null ? description.trim() : null);
            gift.setStore(store);
            gift.setStatus(Gift.GiftStatus.PLANNED);

            // Decide how to store image (URL or upload)
            String imgUrl = null;
            if (image != null && !image.isEmpty()) {
                imgUrl = imageService.uploadImage(image);
            } else if (imageUrl != null && !imageUrl.isBlank()) {
                imgUrl = imageUrl;
            }
            gift.setImage(imgUrl);

            gift.setCreatedAt(LocalDateTime.now());
            gift.setUpdatedAt(LocalDateTime.now());

            Gift savedGift = giftRepository.save(gift);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "🎁 Gift added successfully!", "gift", savedGift));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error adding gift: " + e.getMessage()));
        }
    }

    // Get gifts by event (for event pages)
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getGiftsByEvent(@PathVariable Long eventId) {
        try {
            List<Gift> gifts = giftRepository.findByEventId(eventId);
            List<GiftDTO> dtos = gifts.stream()
                .map(this::mapGiftToDTO)
                .toList();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching gifts"));
        }
    }

    
    @GetMapping("/event/{eventId}/user/{userId}")
    public ResponseEntity<?> getGiftsForUser(@PathVariable Long eventId, @PathVariable Long userId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) 
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Event not found"));
        Event event = eventOpt.get();
        if (event.getCreator() != null && event.getCreator().getId().equals(userId)) {
            // Creator sees nothing!
            return ResponseEntity.ok(List.of());
        }
        List<Gift> gifts = giftRepository.findByEventId(eventId);
        List<GiftDTO> dtos = gifts.stream()
            .map(this::mapGiftToDTO)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * Update Gift with Cloudinary
     */
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateGift(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "recipient", required = false) String recipient,
            @RequestParam(value = "description", required = false) String description,
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
            if (price != null) gift.setPrice(price);
            if (status != null) gift.setStatus(status);
            if (description != null) gift.setDescription(description);

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
            List<Gift> gifts = giftRepository.findAll();
            List<GiftDTO> dtos = gifts.stream()
                .map(this::mapGiftToDTO)
                .toList();
            return ResponseEntity.ok(dtos);
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

    // New endpoint for users to remove their planned gifts
    // Remove gift (only if plannedBy)
@DeleteMapping("/{giftId}/user/{userId}")
public ResponseEntity<?> removePlannedGift(@PathVariable Long giftId, @PathVariable Long userId) {
    Optional<Gift> giftOptional = giftRepository.findById(giftId);
    if (giftOptional.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Gift not found"));
    }
    Gift gift = giftOptional.get();
    if (gift.getPlannedBy() == null || !gift.getPlannedBy().getId().equals(userId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "You can only remove gifts you planned"));
    }
    if (gift.getImage() != null && gift.getImage().startsWith("http")) {
        // if image is a URL, you may or may not wish to delete it
    }
    giftRepository.deleteById(giftId);
    return ResponseEntity.ok(Map.of(
        "message", "Gift removed from your plan",
        "removedGiftId", giftId
    ));
}


}