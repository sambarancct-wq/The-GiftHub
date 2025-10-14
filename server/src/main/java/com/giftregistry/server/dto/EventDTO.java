package com.giftregistry.server.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// A minimal UserDTO for creator reference
public class EventDTO {
    private Long id;
    private String name;
    private LocalDate date;
    private String eventKey;
    private String description;
    private String location;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long creatorId;
    private String creatorUsername;
    private List<Long> giftIds; // Optional, or add List<GiftDTO> if you want full gift data

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getEventKey() { return eventKey; }
    public void setEventKey(String eventKey) { this.eventKey = eventKey; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }

    public String getCreatorUsername() { return creatorUsername; }
    public void setCreatorUsername(String creatorUsername) { this.creatorUsername = creatorUsername; }

    public List<Long> getGiftIds() { return giftIds; }
    public void setGiftIds(List<Long> giftIds) { this.giftIds = giftIds; }
}
