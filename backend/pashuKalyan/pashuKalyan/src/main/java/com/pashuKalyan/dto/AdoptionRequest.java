package com.pashuKalyan.dto;

public class AdoptionRequest {
    private Long animalId;

    // Default constructor
    public AdoptionRequest() {
    }

    // Constructor with parameters
    public AdoptionRequest(Long animalId) {
        this.animalId = animalId;
    }

    // Getters and setters
    public Long getAnimalId() {
        return animalId;
    }

    public void setAnimalId(Long animalId) {
        this.animalId = animalId;
    }
}