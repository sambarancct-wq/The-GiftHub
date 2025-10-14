package com.giftregistry.server.controller;

import com.giftregistry.server.dto.EventDTO;
import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.RSVP;
import com.giftregistry.server.model.User;
import com.giftregistry.server.repository.EventRepository;
import com.giftregistry.server.repository.UserRepository;
import com.giftregistry.server.service.EmailService;
import com.giftregistry.server.repository.RSVPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RSVPRepository rsvpRepository;

    @Autowired
    private EmailService emailService;

    private EventDTO mapEventToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDate(event.getDate());
        dto.setEventKey(event.getEventKey());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setType(event.getType() != null ? event.getType().name() : null);
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        if (event.getCreator() != null) {
            dto.setCreatorId(event.getCreator().getId());
            dto.setCreatorUsername(event.getCreator().getUsername());
        }
        if (event.getGifts() != null && !event.getGifts().isEmpty()) {
            dto.setGiftIds(event.getGifts().stream()
                .map(g -> g.getId())
                .toList());
        }
        return dto;
    }

    /**
     * Create a new event
     */
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event, @RequestParam Long creatorId) {
        try {
            System.out.println("🎉 Creating event: " + event.getName() + " for creator: " + creatorId);

            // Validate that creator exists
            Optional<User> creator = userRepository.findById(creatorId);
            if (!creator.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
            }
            
            User creatorUser = creator.get();
            // Check if event name already exists for this creator
            if (eventRepository.existsByNameAndCreator(event.getName(), creatorUser)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Event name already exists for this user"));
            }
            // Set creator and timestamps
            event.setCreator(creatorUser);
            event.setCreatedAt(LocalDateTime.now());
            event.setUpdatedAt(LocalDateTime.now());
            Event savedEvent = eventRepository.save(event);
            
            System.out.println("✅ Event created successfully with ID: " + savedEvent.getId() + " and Key: " + 
            savedEvent.getEventKey());
        
            emailService.sendEventCreationEmail(creatorUser.getEmail(), savedEvent);

            EventDTO dto = mapEventToDTO(savedEvent);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Event created successfully! Check your email for the event key.");
            response.put("event", dto);
            response.put("eventKey", savedEvent.getEventKey());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.err.println("❌ Error creating event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating event: " + e.getMessage()));
        }
    }

    /**
     * Get event dashboard for creator
     */
    @GetMapping("/dashboard/{eventId}")
    public ResponseEntity<?> getEventDashboard(@PathVariable Long eventId, @RequestParam Long creatorId) {
        try {
            Optional<Event> eventOptional = eventRepository.findById(eventId);
            if (eventOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Event not found"));
            }

            Event event = eventOptional.get();
            
            // Verify the user is the creator
            if (!event.getCreator().getId().equals(creatorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied"));
            }

            // Get RSVP counts
            long attendingCount = rsvpRepository.countByEventAndStatus(event, RSVP.RSVPStatus.ACCEPTED);
            long declinedCount = rsvpRepository.countByEventAndStatus(event, RSVP.RSVPStatus.DECLINED);
            long pendingCount = rsvpRepository.countByEventAndStatus(event, RSVP.RSVPStatus.PENDING);

            EventDTO dto = mapEventToDTO(event);

            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("event", dto);
            dashboard.put("attendingCount", attendingCount);
            dashboard.put("declinedCount", declinedCount);
            dashboard.put("pendingCount", pendingCount);
            dashboard.put("totalInvited", attendingCount + declinedCount + pendingCount);

            return ResponseEntity.ok(dashboard);

        } catch (Exception e) {
            System.err.println("❌ Error fetching dashboard: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching dashboard"));
        }
    }

    /**
     * Send RSVP invitations
     */
    @PostMapping("/{eventId}/invite")
    public ResponseEntity<?> sendInvitations(@PathVariable Long eventId, 
                                        @RequestParam Long creatorId,
                                        @RequestBody List<String> guestEmails) {
    try {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        if (eventOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Event not found"));
        }

        Event event = eventOptional.get();
        
        // Verify the user is the creator
        if (!event.getCreator().getId().equals(creatorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied"));
        }

        List<String> successfulEmails = new ArrayList<>();
        List<String> failedEmails = new ArrayList<>();

        // Create RSVP records for each guest and send emails
        for (String email : guestEmails) {
            try {
                RSVP rsvp = new RSVP();
                rsvp.setGuestEmail(email);
                rsvp.setEvent(event);
                rsvp.setStatus(RSVP.RSVPStatus.PENDING);
                RSVP savedRSVP = rsvpRepository.save(rsvp);

                // Send RSVP invitation email
                emailService.sendRSVPInvitation(email, event, savedRSVP.getId());
                successfulEmails.add(email);
                
                System.out.println("✅ RSVP invitation sent to: " + email);

            } catch (Exception e) {
                System.err.println("❌ Failed to send invitation to: " + email + " - " + e.getMessage());
                failedEmails.add(email + " (" + e.getMessage() + ")");
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Invitation process completed");
        response.put("successful", successfulEmails);
        response.put("failed", failedEmails);
        response.put("totalSent", successfulEmails.size());
        response.put("totalFailed", failedEmails.size());

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        System.err.println("❌ Error sending invitations: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error sending invitations: " + e.getMessage()));
    }
}

    /**
     * Find event by key (for guests)
     */
    @GetMapping("/key/{eventKey}")
    public ResponseEntity<?> getEventByKey(@PathVariable String eventKey) {
        try {
            Optional<Event> event = eventRepository.findByEventKey(eventKey);
            if (event.isPresent()) {
                Event eventResponse = event.get();
                eventResponse.setCreator(null); // Hide creator details
                EventDTO dto = mapEventToDTO(eventResponse);
                dto.setCreatorId(null);
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Event not found"));
            }
        } catch (Exception e) {
            System.err.println("❌ Error fetching event: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching event"));
        }
    }

    /**
     * Get RSVP details for an event
     */
    @GetMapping("/{eventId}/rsvps")
    public ResponseEntity<?> getEventRSVPs(@PathVariable Long eventId, @RequestParam Long creatorId) {
        try {
            Optional<Event> eventOptional = eventRepository.findById(eventId);
            if (eventOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Event not found"));
            }

            Event event = eventOptional.get();
            
            // Verify the user is the creator
            if (!event.getCreator().getId().equals(creatorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied"));
            }

            List<RSVP> rsvps = rsvpRepository.findByEvent(event);
            return ResponseEntity.ok(rsvps);

        } catch (Exception e) {
            System.err.println("❌ Error fetching RSVPs: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching RSVPs"));
        }
    }


    /**
     * Get all events (public - for all users to browse)
     */
    @GetMapping("/public")
    public ResponseEntity<?> getAllPublicEvents() {
        try {
            List<Event> events = eventRepository.findAll();
            List<EventDTO> dtos = events.stream()
                        .map(this::mapEventToDTO)
                        .collect(Collectors.toList());
            System.out.println("📋 Found " + dtos.size() + " public events");
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("❌ Error fetching public events: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching events"));
        }
    }

    /**
     * Get events by creator (user)
     */
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<?> getEventsByCreator(@PathVariable Long creatorId) {
        try {
            List<Event> events = eventRepository.findByCreatorId(creatorId);
            List<EventDTO> dtos = events.stream()
                    .map(this::mapEventToDTO)
                    .collect(Collectors.toList());
            System.out.println("📋 Found " + dtos.size() + " events for creator: " + creatorId);
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("❌ Error fetching creator events: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching events"));
        }
    }

    /**
     * Get event by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            Optional<Event> eventOpt = eventRepository.findById(id);
            if (eventOpt.isPresent()) {
                Event event = eventOpt.get();
                System.out.println("📖 Found event: " + event.getName());
                EventDTO dto = mapEventToDTO(event);
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Event not found"));
            }
        } catch (Exception e) {
            System.err.println("❌ Error fetching event: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching event"));
        }
    }

    /**
     * Update event - only allowed for event creator
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails, @RequestParam Long creatorId) {
        try {
            Optional<Event> eventOptional = eventRepository.findById(id);
            if (eventOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Event not found"));
            }

            Event event = eventOptional.get();
            
            // Check if the user is the creator of this event
            if (!event.getCreator().getId().equals(creatorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only the event creator can update this event"));
            }
            
            // Update fields if provided
            if (eventDetails.getName() != null) event.setName(eventDetails.getName());
            if (eventDetails.getDescription() != null) event.setDescription(eventDetails.getDescription());
            if (eventDetails.getEventDate() != null) event.setEventDate(eventDetails.getEventDate());
            if (eventDetails.getLocation() != null) event.setLocation(eventDetails.getLocation());
            if (eventDetails.getType() != null) event.setType(eventDetails.getType());
            
            event.setUpdatedAt(LocalDateTime.now());
            
            Event updatedEvent = eventRepository.save(event);
            EventDTO dto = mapEventToDTO(updatedEvent);
            
            System.out.println("✅ Event updated successfully: " + updatedEvent.getName());

            return ResponseEntity.ok(Map.of(
                "message", "Event updated successfully!",
                "event", dto
            ));

        } catch (Exception e) {
            System.err.println("❌ Error updating event: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating event"));
        }
    }

    /**
     * Delete event - only allowed for event creator
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, @RequestParam Long creatorId) {
        try {
            Optional<Event> eventOptional = eventRepository.findById(id);
            if (eventOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Event not found"));
            }

            Event event = eventOptional.get();
            
            // Check if the user is the creator of this event
            if (!event.getCreator().getId().equals(creatorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only the event creator can delete this event"));
            }
            
            eventRepository.deleteById(id);
            System.out.println("🗑️ Event deleted: " + id);
            
            return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));

        } catch (Exception e) {
            System.err.println("❌ Error deleting event: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting event"));
        }
    }

    /**
 * Get events by type/category
 */
@GetMapping("/category/{category}")
public ResponseEntity<?> getEventsByCategory(@PathVariable String category) {
    try {
        // 1. Convert the incoming string (e.g., "birthday") to the corresponding enum
        Event.EventType eventType;
        try {
            eventType = Event.EventType.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle cases where the category is invalid (e.g., "party")
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid event category: " + category));
        }

        // 2. Call the correct, type-safe repository method
        List<Event> events = eventRepository.findByType(eventType);
        List<EventDTO> dtos = events.stream()
                    .map(this::mapEventToDTO)
                    .collect(Collectors.toList());
        System.out.println("📋 Found " + dtos.size() + " events in category: " + category);
        return ResponseEntity.ok(dtos);

    } catch (Exception e) {
        System.err.println("❌ Error fetching events by category: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error fetching events"));
    }
}

    /**
     * Get upcoming events
     */
    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingEvents() {
        try {
            LocalDate today = LocalDate.now();
            List<Event> events = eventRepository.findByDateAfter(today);
            List<EventDTO> dtos = events.stream()
                    .map(this::mapEventToDTO)
                    .collect(Collectors.toList());    
            System.out.println("📋 Found " + dtos.size() + " upcoming events");
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("❌ Error fetching upcoming events: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching upcoming events"));
        }
    }

    /**
     * Search events by name or description
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchEvents(@RequestParam String query) {
        try {
            List<Event> events = eventRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
            List<EventDTO> dtos = events.stream()
                    .map(this::mapEventToDTO)
                    .collect(Collectors.toList());
            System.out.println("🔍 Found " + dtos.size() + " events matching: " + query);
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.err.println("❌ Error searching events: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error searching events"));
        }
    }
}