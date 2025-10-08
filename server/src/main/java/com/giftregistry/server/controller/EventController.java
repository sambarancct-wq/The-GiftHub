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
    public ResponseEntity<?> createEvent(@RequestBody Event event, @RequestParam Long organizerId) {
        try {
            System.out.println("🎉 Creating event: " + event.getName() + " for organizer: " + organizerId);

            // Validate that organizer exists and is actually an organizer
            Optional<User> organizer = userRepository.findById(organizerId);
            if (!organizer.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Organizer not found"));
            }
            
            User organizerUser = organizer.get();
            if (!organizerUser.getIsOrganizer()) {
                return ResponseEntity.badRequest().body(Map.of("message", "User is not an organizer"));
            }

            // Check if event name already exists for this organizer
            if (eventRepository.existsByNameAndOrganizer(event.getName(), organizerUser)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Event name already exists for this organizer"));
            }

            // Set organizer and timestamps
            event.setOrganizer(organizerUser);
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
     * Get all events (public - for buyers to browse)
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
     * Get events by organizer
     */
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<?> getEventsByOrganizer(@PathVariable Long organizerId) {
        try {
            List<Event> events = eventRepository.findByOrganizerId(organizerId);
            System.out.println("📋 Found " + events.size() + " events for organizer: " + organizerId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("❌ Error fetching organizer events: " + e.getMessage());
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
     * Update event
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        try {
            Optional<Event> eventOptional = eventRepository.findById(id);
            if (eventOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Event not found"));
            }

            Event event = eventOptional.get();
            
            // Update fields if provided
            if (eventDetails.getName() != null) event.setName(eventDetails.getName());
            if (eventDetails.getDescription() != null) event.setDescription(eventDetails.getDescription());
            if (eventDetails.getDate() != null) event.setDate(eventDetails.getDate());
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
     * Delete event
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            if (!eventRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Event not found"));
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
            Event.EventType type;
            try {
                type = Event.EventType.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid event category"));
            }
            
            List<Event> events = eventRepository.findByType(type);
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
}