package com.pashuKalyan.dto;

import com.pashuKalyan.model.PaymentMethod;
import com.pashuKalyan.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// DonationRecordRequestDTO - Used for recording a new donation
public class DonationRecordRequestDTO {
    private Long userId;
    private String transactionUuid;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    private List<DonationItemDTO> items;

    // Default constructor
    public DonationRecordRequestDTO() {
    }

    // Getters and Setters
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

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public List<DonationItemDTO> getItems() {
        return items;
    }

    public void setItems(List<DonationItemDTO> items) {
        this.items = items;
    }
}
