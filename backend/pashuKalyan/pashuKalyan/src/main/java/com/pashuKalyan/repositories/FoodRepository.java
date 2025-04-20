package com.pashuKalyan.repositories;

import com.pashuKalyan.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByNameContainingIgnoreCase(String name);



    List<Food> findByPriceBetween(Double minPrice, Double maxPrice);
}