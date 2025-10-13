package com.giftregistry.server.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "gifts")
public class Gift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String recipient;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    private String productUrl;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String store;
    
    public enum GiftStatus { PLANNED, CANCELLED, PURCHASED}
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GiftStatus status = GiftStatus.PLANNED;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @JsonBackReference("event-gifts")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planned_by_id")
    @JsonIgnore
    private User plannedBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Gift() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Gift(String name, String recipient, BigDecimal price, Event event) {
        this();
        this.name = name;
        this.recipient = recipient;
        this.price = price;
        this.event = event;
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
    
    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }
        
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public GiftStatus getStatus() { return status; }
    public void setStatus(GiftStatus status) { this.status = status; }
    
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getProductUrl() { return productUrl; }
    public void setProductUrl(String productUrl) { this.productUrl = productUrl; }
    
    public String getStore() { return store; }
    public void setStore(String store) { this.store = store; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getPlannedBy() { return plannedBy; }
    public void setPlannedBy(User plannedBy) { this.plannedBy = plannedBy; }
}