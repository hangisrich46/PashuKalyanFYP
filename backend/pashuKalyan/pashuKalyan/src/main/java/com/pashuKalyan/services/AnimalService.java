package com.pashuKalyan.services;

import com.pashuKalyan.model.Animal;
import com.pashuKalyan.repositories.AnimalRepository;
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
public class AnimalService {

    private final AnimalRepository animalRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    public AnimalService(AnimalRepository animalRepository) {
        this.animalRepository = animalRepository;
    }

    public List<Animal> getAllAnimals() {
        return animalRepository.findAll();
    }

    public Optional<Animal> getAnimalById(Long id) {
        return animalRepository.findById(id);
    }

    public Animal createAnimal(Animal animal, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImage(imageFile);
            animal.setImageUrl("/uploads/" + fileName);
        }
        return animalRepository.save(animal);
    }

    public Animal updateAnimal(Long id, Animal animalDetails, MultipartFile imageFile) throws IOException {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + id));

        animal.setName(animalDetails.getName());
        animal.setType(animalDetails.getType());
        animal.setAge(animalDetails.getAge());
        animal.setGender(animalDetails.getGender());
        animal.setStatus(animalDetails.getStatus());
        animal.setDescription(animalDetails.getDescription());

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImage(imageFile);
            animal.setImageUrl("/uploads/" + fileName);
        }

        return animalRepository.save(animal);
    }

    public void deleteAnimal(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + id));

        // Delete image if exists
        if (animal.getImageUrl() != null) {
            String fileName = animal.getImageUrl().substring(animal.getImageUrl().lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, fileName);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Failed to delete image file: " + e.getMessage());
            }
        }

        animalRepository.delete(animal);
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
}
