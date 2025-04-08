package com.pashuKalyan.controller;

import com.pashuKalyan.model.Animal;
import com.pashuKalyan.services.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/animals")
@CrossOrigin(origins = "http://localhost:5173") // Adjust based on your frontend URL
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createAnimal(
            @RequestPart("name") String name,
            @RequestPart("type") String type,
            @RequestPart("age") String age,
            @RequestPart("gender") String gender,
            @RequestPart("status") String status,
            @RequestPart("description") String description,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            Animal animal = new Animal();
            animal.setName(name);
            animal.setType(type);
            animal.setAge(age);
            animal.setGender(gender);
            animal.setStatus(status);
            animal.setDescription(description);

            Animal savedAnimal = animalService.createAnimal(animal, imageFile);

            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(true));  // Wrapping the value in Optional
            response.put("data", savedAnimal);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", Optional.of(false));  // Wrapping the value in Optional
            response.put("message", "Failed to create animal: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
