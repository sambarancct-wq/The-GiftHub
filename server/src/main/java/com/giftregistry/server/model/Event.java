package com.giftregistry.server.model;

//import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "event_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(name = "event_key", unique = true)
    private String eventKey;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_id", referencedColumnName = "id")
    //@JsonBackReference("user-events")
    private User creator;
    
    @Column(nullable = false)
    private String description;
    
    private String location;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("event-gifts")
    private List<Gift> gifts = new ArrayList<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("event-rsvps")
    private List<RSVP> rsvps = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType type = EventType.OTHER;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enum for Event Type
    public enum EventType {
        BIRTHDAY, WEDDING, HOLIDAY, ANNIVERSARY, OTHER
    }
    
    // Constructors
    public Event() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.eventKey = generateEventKey();
    }

    private String generateEventKey() {
        return "EVT" + System.currentTimeMillis() + (int)(Math.random() * 1000);
    }
    
    public Event(String name, LocalDate date, User creator, String description, EventType type) {
        this();
        this.name = name;
        this.date = date;
        this.creator = creator;
        this.description = description;
        this.type = type;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public List<Gift> getGifts() { return gifts; }
    public void setGifts(List<Gift> gifts) { this.gifts = gifts; }
    
    public EventType getType() { return type; }
    public void setType(EventType type) { this.type = type; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDate getEventDate() { return date; }
    public void setEventDate(LocalDate date) { this.date = date; }

    public String getEventKey() { return eventKey; }
    public void setEventKey(String eventKey) { this.eventKey = eventKey; }

    public List<RSVP> getRsvps() { return rsvps; }
    public void setRsvps(List<RSVP> rsvps) { this.rsvps = rsvps; }
}