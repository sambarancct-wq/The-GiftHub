package com.giftregistry.server.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "rsvps")
public class RSVP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String guestEmail;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RSVPStatus status; // PENDING, ACCEPTED, DECLINED
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @JsonBackReference("event-rsvps")
    private Event event;
    
    @Column(name = "responded_at")
    private LocalDateTime respondedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public RSVP() {
        this.createdAt = LocalDateTime.now();
        this.status = RSVPStatus.PENDING;
    }
    
    public enum RSVPStatus {
        PENDING, ACCEPTED, DECLINED
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }
    
    public RSVPStatus getStatus() { return status; }
    public void setStatus(RSVPStatus status) { 
        this.status = status;
        if (status != RSVPStatus.PENDING) {
            this.respondedAt = LocalDateTime.now();
        }
    }
    
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    
    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}