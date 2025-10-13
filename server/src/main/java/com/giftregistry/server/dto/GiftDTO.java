package com.giftregistry.server.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class GiftDTO {
    private Long id;
    private String name;
    private String recipient;
    private BigDecimal price;
    private String image;
    private String productUrl;
    private String description;
    private String store;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long plannedById;

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

    public String getProductUrl() { return productUrl; }
    public void setProductUrl(String productUrl) { this.productUrl = productUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStore() { return store; }
    public void setStore(String store) { this.store = store; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getPlannedById() { return plannedById; }
    public void setPlannedById(Long plannedById) { this.plannedById = plannedById; }
}
