package com.giftregistry.server.controller;

import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.User;
import com.giftregistry.server.repository.EventRepository;
import com.giftregistry.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

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
            
            System.out.println("✅ Event created successfully with ID: " + savedEvent.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Event created successfully!");
            response.put("event", savedEvent);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.err.println("❌ Error creating event: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating event: " + e.getMessage()));
        }
    }

    /**
     * Get all events (public - for all users to browse)
     */
    @GetMapping("/public")
    public ResponseEntity<?> getAllPublicEvents() {
        try {
            List<Event> events = eventRepository.findAll();
            System.out.println("📋 Found " + events.size() + " public events");
            return ResponseEntity.ok(events);
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
            System.out.println("📋 Found " + events.size() + " events for creator: " + creatorId);
            return ResponseEntity.ok(events);
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
            Optional<Event> event = eventRepository.findById(id);
            if (event.isPresent()) {
                System.out.println("📖 Found event: " + event.get().getName());
                return ResponseEntity.ok(event.get());
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
            
            System.out.println("✅ Event updated successfully: " + updatedEvent.getName());

            return ResponseEntity.ok(Map.of(
                "message", "Event updated successfully!",
                "event", updatedEvent
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
        
        System.out.println("📋 Found " + events.size() + " events in category: " + category);
        return ResponseEntity.ok(events);

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
            System.out.println("📋 Found " + events.size() + " upcoming events");
            return ResponseEntity.ok(events);
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
            System.out.println("🔍 Found " + events.size() + " events matching: " + query);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("❌ Error searching events: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error searching events"));
        }
    }
}