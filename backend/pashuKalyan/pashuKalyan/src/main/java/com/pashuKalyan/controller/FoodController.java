package com.pashuKalyan.controller;

import com.pashuKalyan.model.Food;
import com.pashuKalyan.services.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "http://localhost:5173") // Adjust based on your frontend URL
public class FoodController {

    @Autowired
    private FoodService foodService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createFood(
            @RequestPart("name") String name,
            @RequestPart("price") String price,
            @RequestPart("description") String description,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            Food food = new Food();
            food.setName(name);
            food.setPrice(Double.parseDouble(price));
            food.setDescription(description);

            Food savedFood = foodService.createFood(food, imageFile);

            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(true));  // Wrapping the value in Optional
            response.put("data", savedFood);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(false));  // Wrapping the value in Optional
            response.put("message", "Failed to create food item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllFoods() {
        try {
            List<Food> foods = foodService.getAllFoods();

            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(true));
            response.put("data", foods);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(false));
            response.put("message", "Failed to retrieve food items: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getFoodById(@PathVariable Long id) {
        try {
            Optional<Food> food = foodService.getFoodById(id);

            if (food.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", Optional.of(true));
                response.put("data", food.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", Optional.of(false));
                response.put("message", "Food item not found with id: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(false));
            response.put("message", "Failed to retrieve food item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateFood(
            @PathVariable Long id,
            @RequestPart("name") String name,
            @RequestPart("price") String price,
            @RequestPart("description") String description,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            Food foodDetails = new Food();
            foodDetails.setName(name);
            foodDetails.setPrice(Double.parseDouble(price));
            foodDetails.setDescription(description);

            Food updatedFood = foodService.updateFood(id, foodDetails, imageFile);

            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(true));
            response.put("data", updatedFood);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(false));
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(false));
            response.put("message", "Failed to update food item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFood(@PathVariable Long id) {
        try {
            foodService.deleteFood(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(true));
            response.put("message", "Food item deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(false));
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchFoods(@RequestParam("name") String name) {
        try {
            List<Food> foods = foodService.searchFoodsByName(name);

            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(true));
            response.put("data", foods);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(false));
            response.put("message", "Failed to search food items: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}