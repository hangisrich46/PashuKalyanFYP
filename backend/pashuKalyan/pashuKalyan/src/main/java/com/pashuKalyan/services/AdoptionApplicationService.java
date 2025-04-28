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
    private final EmailService emailService; // 💬 Inject EmailService here

    @Autowired
    public AdoptionApplicationService(
            AdoptionApplicationRepository adoptionRepository,
            UserRepository userRepository,
            AnimalRepository animalRepository,
            EmailService emailService
    ) {
        this.adoptionRepository = adoptionRepository;
        this.userRepository = userRepository;
        this.animalRepository = animalRepository;
        this.emailService = emailService;
    }

    public AdoptionApplication createApplication(Long animalId, String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        Optional<Animal> animalOpt = animalRepository.findById(animalId);

        if (userOpt.isPresent() && animalOpt.isPresent()) {
            User user = userOpt.get();
            Animal animal = animalOpt.get();

            if (adoptionRepository.existsByAnimalAndUser(animal, user)) {
                throw new RuntimeException("You have already applied to adopt this animal");
            }

            if (!"Available".equals(animal.getStatus())) {
                throw new RuntimeException("This animal is not available for adoption");
            }

            AdoptionApplication application = new AdoptionApplication(animal, user);

            animal.setStatus("Application Pending");
            animalRepository.save(animal);

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

            Animal animal = application.getAnimal();

            if ("Approved".equals(newStatus)) {
                animal.setStatus("Adopted");
                animalRepository.save(animal);

                // ✅ Send approval email
                emailService.sendEmail(
                        application.getUser().getEmail(),
                        "Adoption Application Approved",
                        "Congratulations! Your application to adopt " + animal.getName() + " has been approved."
                );

            } else if ("Rejected".equals(newStatus)) {
                animal.setStatus("Available");
                animalRepository.save(animal);

                // ✅ Send rejection email
                emailService.sendEmail(
                        application.getUser().getEmail(),
                        "Adoption Application Rejected",
                        "We are sorry. Your application to adopt " + animal.getName() + " has been rejected."
                );
            }

            return adoptionRepository.save(application);
        }
        throw new RuntimeException("Application not found");
    }
}
