package com.pashuKalyan.services;

import com.pashuKalyan.model.BlogPost;
import com.pashuKalyan.repositories.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Get all blog posts
    public List<BlogPost> getAllPosts() {
        return blogRepository.findAllByOrderByDateDesc();
    }

    // Get post by ID
    public Optional<BlogPost> getPostById(Long id) {
        return blogRepository.findById(id);
    }

    // Create a new blog post
    public BlogPost createPost(BlogPost blogPost, MultipartFile imageFile) throws IOException {
        // Set the current date
        blogPost.setDate(LocalDate.now());

        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            blogPost.setImageUrl(imagePath);
        }

        return blogRepository.save(blogPost);
    }

    // Update an existing blog post
    public BlogPost updatePost(Long id, BlogPost blogPostDetails, MultipartFile imageFile) throws IOException {
        Optional<BlogPost> optionalBlogPost = blogRepository.findById(id);

        if (!optionalBlogPost.isPresent()) {
            throw new RuntimeException("Blog post not found with id: " + id);
        }

        BlogPost existingPost = optionalBlogPost.get();
        existingPost.setTitle(blogPostDetails.getTitle());
        existingPost.setContent(blogPostDetails.getContent());
        existingPost.setCategory(blogPostDetails.getCategory());
        existingPost.setAuthor(blogPostDetails.getAuthor());

        // Handle image upload if a new image is provided
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete the old image if it exists
            if (existingPost.getImageUrl() != null) {
                deleteImage(existingPost.getImageUrl());
            }

            String imagePath = saveImage(imageFile);
            existingPost.setImageUrl(imagePath);
        }

        return blogRepository.save(existingPost);
    }

    // Delete a blog post
    public void deletePost(Long id) {
        Optional<BlogPost> optionalBlogPost = blogRepository.findById(id);

        if (!optionalBlogPost.isPresent()) {
            throw new RuntimeException("Blog post not found with id: " + id);
        }

        BlogPost blogPost = optionalBlogPost.get();

        // Delete the associated image if it exists
        if (blogPost.getImageUrl() != null) {
            deleteImage(blogPost.getImageUrl());
        }

        blogRepository.deleteById(id);
    }

    // Helper method to save an image file
    private String saveImage(MultipartFile file) throws IOException {
        // Create the upload directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate a unique filename to prevent collisions
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filepath = Paths.get(uploadDir, filename);

        // Save the file
        Files.write(filepath, file.getBytes());

        // Return the relative path to the file for storage in the database
        return "/uploads/" + filename;
    }

    // Helper method to delete an image file
    private void deleteImage(String imageUrl) {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            try {
                String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                Path filepath = Paths.get(uploadDir, filename);
                Files.deleteIfExists(filepath);
            } catch (IOException e) {
                // Log the error but continue with the operation
                System.err.println("Error deleting image: " + e.getMessage());
            }
        }
    }
}
