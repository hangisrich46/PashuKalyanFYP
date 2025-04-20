package com.pashuKalyan.services;

import com.pashuKalyan.model.Food;
import com.pashuKalyan.repositories.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public Optional<Food> getFoodById(Long id) {
        return foodRepository.findById(id);
    }

    public Food createFood(Food food, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImage(imageFile);
            food.setImageUrl("/uploads/" + fileName);
        }
        return foodRepository.save(food);
    }

    public Food updateFood(Long id, Food foodDetails, MultipartFile imageFile) throws IOException {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + id));

        food.setName(foodDetails.getName());
        food.setDescription(foodDetails.getDescription());
        food.setPrice(foodDetails.getPrice());

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImage(imageFile);
            food.setImageUrl("/uploads/" + fileName);
        }

        return foodRepository.save(food);
    }

    public void deleteFood(Long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + id));

        // Delete image if exists
        if (food.getImageUrl() != null) {
            String fileName = food.getImageUrl().substring(food.getImageUrl().lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, fileName);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Failed to delete image file: " + e.getMessage());
            }
        }

        foodRepository.delete(food);
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Ensure upload directory exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(fileName);

        Files.write(filePath, file.getBytes());

        return fileName;
    }

    // Additional search methods if needed
    public List<Food> searchFoodsByName(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Food> getFoodsByPriceRange(Double minPrice, Double maxPrice) {
        return foodRepository.findByPriceBetween(minPrice, maxPrice);
    }
}