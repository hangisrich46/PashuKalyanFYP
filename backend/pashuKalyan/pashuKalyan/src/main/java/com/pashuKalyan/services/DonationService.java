package com.pashuKalyan.services;

import com.pashuKalyan.dto.DonationItemDTO;
import com.pashuKalyan.dto.DonationRecordRequestDTO;
import com.pashuKalyan.dto.DonationResponseDTO;
import com.pashuKalyan.model.Donation;
import com.pashuKalyan.model.DonationItem;
import com.pashuKalyan.repositories.DonationItemRepository;
import com.pashuKalyan.repositories.DonationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final DonationItemRepository donationItemRepository;

    @Autowired
    public DonationService(DonationRepository donationRepository, DonationItemRepository donationItemRepository) {
        this.donationRepository = donationRepository;
        this.donationItemRepository = donationItemRepository;
    }

    /**
     * Record a new donation with its items
     *
     * @param requestDTO the donation record request DTO
     * @return the created donation response DTO
     */
    @Transactional
    public DonationResponseDTO recordDonation(DonationRecordRequestDTO requestDTO) {
        // Create new donation entity
        Donation donation = new Donation();
        donation.setUserId(requestDTO.getUserId());
        donation.setTransactionUuid(requestDTO.getTransactionUuid());
        donation.setPaymentMethod(requestDTO.getPaymentMethod());
        donation.setPaymentStatus(requestDTO.getPaymentStatus());
        donation.setSubtotalAmount(requestDTO.getSubtotal());
        donation.setTaxAmount(requestDTO.getTax());
        donation.setTotalAmount(requestDTO.getTotal());
        donation.setCreatedAt(LocalDateTime.now());

        // Create donation items
        List<DonationItem> items = new ArrayList<>();
        for (DonationItemDTO itemDTO : requestDTO.getItems()) {
            DonationItem item = new DonationItem();
            item.setItemId(itemDTO.getItemId());
            item.setName(itemDTO.getName());
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(itemDTO.getPrice());
            item.setTotalPrice(itemDTO.getTotalPrice());
            item.setDonation(donation);
            items.add(item);
        }

        donation.setItems(items);

        // Save donation (will cascade to items)
        Donation savedDonation = donationRepository.save(donation);

        // Convert to response DTO
        return convertToResponseDTO(savedDonation);
    }

    /**
     * Get all donations
     *
     * @return list of all donation response DTOs
     */
    @Transactional(readOnly = true)
    public List<DonationResponseDTO> getAllDonations() {
        List<Donation> donations = donationRepository.findAll();
        return donations.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get donation by ID
     *
     * @param donationId the donation ID
     * @return the donation response DTO
     * @throws EntityNotFoundException if donation not found
     */
    @Transactional(readOnly = true)
    public DonationResponseDTO getDonationById(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new EntityNotFoundException("Donation not found with ID: " + donationId));
        return convertToResponseDTO(donation);
    }

    /**
     * Get donations by user ID
     *
     * @param userId the user ID
     * @return list of donation response DTOs
     */
    @Transactional(readOnly = true)
    public List<DonationResponseDTO> getDonationsByUserId(Long userId) {
        List<Donation> donations = donationRepository.findAllByUserId(userId);
        return donations.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Generate invoice for a donation
     *
     * @param donationId the donation ID
     * @return ResponseEntity containing the invoice file
     * @throws EntityNotFoundException if donation not found
     */
    @Transactional(readOnly = true)
    public ResponseEntity<Resource> generateInvoice(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new EntityNotFoundException("Donation not found with ID: " + donationId));

        // Create a simple text-based invoice (in a real app, you might use a PDF library)
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            StringBuilder invoiceContent = new StringBuilder();

            // Add donation details to the invoice
            invoiceContent.append("DONATION RECEIPT\n");
            invoiceContent.append("==========================\n\n");
            invoiceContent.append("Transaction ID: ").append(donation.getTransactionUuid()).append("\n");
            invoiceContent.append("Date: ").append(donation.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
            invoiceContent.append("Payment Method: ").append(donation.getPaymentMethod()).append("\n");
            invoiceContent.append("Status: ").append(donation.getPaymentStatus()).append("\n\n");

            invoiceContent.append("ITEMS\n");
            invoiceContent.append("==========================\n");
            invoiceContent.append(String.format("%-30s %-10s %-10s %-10s\n", "Item", "Qty", "Price", "Total"));

            for (DonationItem item : donation.getItems()) {
                invoiceContent.append(String.format("%-30s %-10d %-10.2f %-10.2f\n",
                        item.getName(),
                        item.getQuantity(),
                        item.getPrice().doubleValue(),
                        item.getTotalPrice().doubleValue()
                ));
            }

            invoiceContent.append("\n");
            invoiceContent.append("Subtotal: Rs ").append(donation.getSubtotalAmount()).append("\n");
            invoiceContent.append("Tax (13%): Rs ").append(donation.getTaxAmount()).append("\n");
            invoiceContent.append("Total: Rs ").append(donation.getTotalAmount()).append("\n\n");

            invoiceContent.append("Thank you for your generous donation!\n");
            invoiceContent.append("Pashu Kalyan - Animal Welfare Organization\n");

            outputStream.write(invoiceContent.toString().getBytes());

            // Create resource from the byte array
            ByteArrayResource resource = new ByteArrayResource(outputStream.toByteArray());

            // Build response entity
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=donation_receipt_" + donationId + ".txt")
                    .contentType(MediaType.TEXT_PLAIN)
                    .contentLength(resource.contentLength())
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice", e);
        }
    }

    /**
     * Convert a donation entity to a response DTO
     *
     * @param donation the donation entity
     * @return the donation response DTO
     */
    private DonationResponseDTO convertToResponseDTO(Donation donation) {
        DonationResponseDTO responseDTO = new DonationResponseDTO();
        responseDTO.setDonationId(donation.getId());
        responseDTO.setUserId(donation.getUserId());
        responseDTO.setTransactionUuid(donation.getTransactionUuid());
        responseDTO.setPaymentStatus(donation.getPaymentStatus());
        responseDTO.setPaymentMethod(donation.getPaymentMethod());
        responseDTO.setSubtotalAmount(donation.getSubtotalAmount());
        responseDTO.setTaxAmount(donation.getTaxAmount());
        responseDTO.setTotalAmount(donation.getTotalAmount());
        responseDTO.setCreatedAt(donation.getCreatedAt());

        // Convert donation items to DTOs
        List<DonationItemDTO> itemDTOs = donation.getItems().stream()
                .map(item -> new DonationItemDTO(
                        item.getItemId(),
                        item.getName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getTotalPrice()))
                .collect(Collectors.toList());

        responseDTO.setItems(itemDTOs);

        return responseDTO;
    }
}