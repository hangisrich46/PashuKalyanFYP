package com.pashuKalyan.repositories;

import com.pashuKalyan.model.AdoptionApplication;
import com.pashuKalyan.model.Animal;
import com.pashuKalyan.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionApplicationRepository extends JpaRepository<AdoptionApplication, Long> {
    List<AdoptionApplication> findByUser(User user);
    List<AdoptionApplication> findByAnimal(Animal animal);
    List<AdoptionApplication> findByStatus(String status);
    boolean existsByAnimalAndUser(Animal animal, User user);
}