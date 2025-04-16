package com.pashuKalyan.services;

import com.pashuKalyan.model.AdoptionApplication;
import com.pashuKalyan.model.Animal;
import com.pashuKalyan.model.User;
import com.pashuKalyan.repositories.AdoptionApplicationRepository;
import com.pashuKalyan.repositories.AnimalRepository;
import com.pashuKalyan.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdoptionApplicationService {

    private final AdoptionApplicationRepository adoptionRepository;
    private final UserRepository userRepository;
    private final AnimalRepository animalRepository;

    @Autowired
    public AdoptionApplicationService(
            AdoptionApplicationRepository adoptionRepository,
            UserRepository userRepository,
            AnimalRepository animalRepository) {
        this.adoptionRepository = adoptionRepository;
        this.userRepository = userRepository;
        this.animalRepository = animalRepository;
    }

    public AdoptionApplication createApplication(Long animalId, String userEmail) {
        // Find the user by email
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        // Find the animal by id
        Optional<Animal> animalOpt = animalRepository.findById(animalId);

        if (userOpt.isPresent() && animalOpt.isPresent()) {
            User user = userOpt.get();
            Animal animal = animalOpt.get();

            // Check if application already exists
            if (adoptionRepository.existsByAnimalAndUser(animal, user)) {
                throw new RuntimeException("You have already applied to adopt this animal");
            }

            // Check if animal is available for adoption
            if (!"Available".equals(animal.getStatus())) {
                throw new RuntimeException("This animal is not available for adoption");
            }

            // Create new application
            AdoptionApplication application = new AdoptionApplication(animal, user);

            // Update animal status
            animal.setStatus("Application Pending");
            animalRepository.save(animal);

            // Save and return application
            return adoptionRepository.save(application);
        } else {
            throw new RuntimeException("User or animal not found");
        }
    }

    public List<AdoptionApplication> getUserApplications(String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isPresent()) {
            return adoptionRepository.findByUser(userOpt.get());
        }
        throw new RuntimeException("User not found");
    }

    public List<AdoptionApplication> getAnimalApplications(Long animalId) {
        Optional<Animal> animalOpt = animalRepository.findById(animalId);
        if (animalOpt.isPresent()) {
            return adoptionRepository.findByAnimal(animalOpt.get());
        }
        throw new RuntimeException("Animal not found");
    }

    public List<AdoptionApplication> getAllApplications() {
        return adoptionRepository.findAll();
    }

    public List<AdoptionApplication> getPendingApplications() {
        return adoptionRepository.findByStatus("Pending");
    }

    public AdoptionApplication updateApplicationStatus(Long applicationId, String newStatus) {
        Optional<AdoptionApplication> applicationOpt = adoptionRepository.findById(applicationId);
        if (applicationOpt.isPresent()) {
            AdoptionApplication application = applicationOpt.get();
            application.setStatus(newStatus);

            // If approved, update animal status
            if ("Approved".equals(newStatus)) {
                Animal animal = application.getAnimal();
                animal.setStatus("Adopted");
                animalRepository.save(animal);
            } else if ("Rejected".equals(newStatus)) {
                Animal animal = application.getAnimal();
                animal.setStatus("Available");
                animalRepository.save(animal);
            }

            return adoptionRepository.save(application);
        }
        throw new RuntimeException("Application not found");
    }
}