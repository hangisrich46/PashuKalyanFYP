package com.pashuKalyan.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "transaction_uuid", unique = true)
    private String transactionUuid;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "subtotal_amount", precision = 10, scale = 2)
    private BigDecimal subtotalAmount;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Default constructor
    public Donation() {
    }

    // Constructor with fields
    public Donation(Long userId, String transactionUuid, PaymentStatus paymentStatus,
                    PaymentMethod paymentMethod, BigDecimal subtotalAmount,
                    BigDecimal taxAmount, BigDecimal totalAmount) {
        this.userId = userId;
        this.transactionUuid = transactionUuid;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.subtotalAmount = subtotalAmount;
        this.taxAmount = taxAmount;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<DonationItem> getItems() {
        return items;
    }

    public void setItems(List<DonationItem> items) {
        this.items = items;
    }

    // Helper method to add an item
    public void addItem(DonationItem item) {
        items.add(item);
        item.setDonation(this);
    }

    // Helper method to remove an item
    public void removeItem(DonationItem item) {
        items.remove(item);
        item.setDonation(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Donation donation = (Donation) o;
        return Objects.equals(id, donation.id) &&
                Objects.equals(transactionUuid, donation.transactionUuid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, transactionUuid);
    }

    @Override
    public String toString() {
        return "Donation{" +
                "id=" + id +
                ", userId=" + userId +
                ", transactionUuid='" + transactionUuid + '\'' +
                ", paymentStatus=" + paymentStatus +
                ", paymentMethod=" + paymentMethod +
                ", subtotalAmount=" + subtotalAmount +
                ", taxAmount=" + taxAmount +
                ", totalAmount=" + totalAmount +
                ", createdAt=" + createdAt +
                '}';
    }
}