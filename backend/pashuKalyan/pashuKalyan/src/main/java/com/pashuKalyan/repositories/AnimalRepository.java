package com.pashuKalyan.repositories;

import com.pashuKalyan.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    // Spring Data JPA will provide basic CRUD operations
    // Add custom query methods if needed
}