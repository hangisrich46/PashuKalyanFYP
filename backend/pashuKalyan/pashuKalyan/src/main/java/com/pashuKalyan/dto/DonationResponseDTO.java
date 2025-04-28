package com.pashuKalyan.dto;


import com.pashuKalyan.model.PaymentMethod;
import com.pashuKalyan.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// DonationResponseDTO - Used for returning donation details
public class DonationResponseDTO {
    private Long donationId;
    private Long userId;
    private String transactionUuid;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private BigDecimal subtotalAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private List<DonationItemDTO> items;

    // Default constructor
    public DonationResponseDTO() {
    }

    // Getters and Setters
    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTransactionUuid() {
        return transactionUuid;
    }

    public void setTransactionUuid(String transactionUuid) {
        this.transactionUuid = transactionUuid;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getSubtotalAmount() {
        return subtotalAmount;
    }

    public void setSubtotalAmount(BigDecimal subtotalAmount) {
        this.subtotalAmount = subtotalAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<DonationItemDTO> getItems() {
        return items;
    }

    public void setItems(List<DonationItemDTO> items) {
        this.items = items;
    }
}