package com.pashuKalyan.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "adoption_applications")
public class AdoptionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String applicantName;

    @Column(nullable = false)
    private String status = "Pending";

    @Column(nullable = false)
    private LocalDate applicationDate;

    // Default constructor
    public AdoptionApplication() {
        this.applicationDate = LocalDate.now();
    }

    // Constructor with parameters
    public AdoptionApplication(Animal animal, User user) {
        this.animal = animal;
        this.user = user;
        this.applicantName = user.getFirstName() + " " + user.getLastName();
        this.status = "Pending";
        this.applicationDate = LocalDate.now();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        // Update applicant name when user is set
        this.applicantName = user.getFirstName() + " " + user.getLastName();
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }
}