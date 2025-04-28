package com.pashuKalyan.dto;

import java.math.BigDecimal;


// DonationItemDTO - Represents a single donation item in the request/response
public class DonationItemDTO {
    private Long itemId;
    private String name;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;

    // Default constructor
    public DonationItemDTO() {
    }

    // Constructor with all fields
    public DonationItemDTO(Long itemId, String name, Integer quantity, BigDecimal price, BigDecimal totalPrice) {
        this.itemId = itemId;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters
    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}