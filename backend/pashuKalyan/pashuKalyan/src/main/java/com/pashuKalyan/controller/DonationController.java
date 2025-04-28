package com.pashuKalyan.controller;

import com.pashuKalyan.dto.DonationRecordRequestDTO;
import com.pashuKalyan.dto.DonationResponseDTO;
import com.pashuKalyan.services.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    @Autowired
    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    /**
     * Record a new donation
     *
     * @param requestDTO donation request data
     * @return response with success status and donation ID
     */
    @PostMapping("/record")
    public ResponseEntity<Map<String, Object>> recordDonation(@RequestBody DonationRecordRequestDTO requestDTO) {
        DonationResponseDTO responseDTO = donationService.recordDonation(requestDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("donationId", responseDTO.getDonationId());
        response.put("transactionUuid", responseDTO.getTransactionUuid());

        return ResponseEntity.ok(response);
    }

    /**
     * Get all donations
     *
     * @return list of all donations
     */
    @GetMapping
    public ResponseEntity<List<DonationResponseDTO>> getAllDonations() {
        List<DonationResponseDTO> donations = donationService.getAllDonations();
        return ResponseEntity.ok(donations);
    }

    /**
     * Get donation by ID
     *
     * @param donationId the donation ID
     * @return the donation details
     */
    @GetMapping("/id/{donationId}")
    public ResponseEntity<DonationResponseDTO> getDonationById(@PathVariable Long donationId) {
        DonationResponseDTO donation = donationService.getDonationById(donationId);
        return ResponseEntity.ok(donation);
    }

    /**
     * Get donations by user ID
     *
     * @param userId the user ID
     * @return list of donations for the user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DonationResponseDTO>> getDonationsByUserId(@PathVariable Long userId) {
        List<DonationResponseDTO> donations = donationService.getDonationsByUserId(userId);
        return ResponseEntity.ok(donations);
    }

    /**
     * Generate and download invoice for a donation
     *
     * @param donationId the donation ID
     * @return the invoice file as a download
     */
    @GetMapping("/id/{donationId}/invoice")
    public ResponseEntity<Resource> downloadInvoice(@PathVariable Long donationId) {
        return donationService.generateInvoice(donationId);
    }
}