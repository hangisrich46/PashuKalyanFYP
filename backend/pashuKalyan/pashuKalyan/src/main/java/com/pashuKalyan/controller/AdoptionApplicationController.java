package com.pashuKalyan.controller;

import com.pashuKalyan.dto.AdoptionRequest;
import com.pashuKalyan.model.AdoptionApplication;
import com.pashuKalyan.services.AdoptionApplicationService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/adoption-applications")
public class AdoptionApplicationController {

    private static final Logger logger = LoggerFactory.getLogger(AdoptionApplicationController.class);

    private final AdoptionApplicationService adoptionService;

    @Autowired
    public AdoptionApplicationController(AdoptionApplicationService adoptionService) {
        this.adoptionService = adoptionService;
    }

    @PostMapping
    public ResponseEntity<?> applyForAdoption(@RequestBody AdoptionRequest request, HttpSession session) {
        try {
            // Get user email from session
            String userEmail = (String) session.getAttribute("userEmail");

            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to apply for adoption");
            }

            logger.info("Adoption application received for animal ID: {} from user: {}", request.getAnimalId(), userEmail);

            // Create adoption application
            AdoptionApplication application = adoptionService.createApplication(request.getAnimalId(), userEmail);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Adoption application submitted successfully!");
            response.put("applicationId", application.getId());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error in adoption application: {}", e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserApplications(HttpSession session) {
        try {
            String userEmail = (String) session.getAttribute("userEmail");

            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to view your applications");
            }

            List<AdoptionApplication> applications = adoptionService.getUserApplications(userEmail);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", applications);
            response.put("count", applications.size());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/animal/{animalId}")
    public ResponseEntity<?> getAnimalApplications(@PathVariable Long animalId) {
        try {
            List<AdoptionApplication> applications = adoptionService.getAnimalApplications(animalId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", applications);
            response.put("count", applications.size());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllApplications() {
        List<AdoptionApplication> applications = adoptionService.getAllApplications();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", applications);
        response.put("count", applications.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingApplications() {
        List<AdoptionApplication> applications = adoptionService.getPendingApplications();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", applications);
        response.put("count", applications.size());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status) {
        try {
            AdoptionApplication application = adoptionService.updateApplicationStatus(applicationId, status);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Application status updated successfully");
            response.put("data", application);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }
}