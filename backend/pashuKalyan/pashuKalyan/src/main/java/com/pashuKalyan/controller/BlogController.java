package com.pashuKalyan.controller;

import com.pashuKalyan.model.BlogPost;
import com.pashuKalyan.services.BlogService;
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
@RequestMapping("/api/blog")
@CrossOrigin(origins = "http://localhost:5173") // Adjust based on your frontend URL
public class BlogController {

    @Autowired
    private BlogService blogService;

    // Get all blog posts
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts() {
        try {
            List<BlogPost> posts = blogService.getAllPosts();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", posts);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve blog posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get blog post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable Long id) {
        try {
            Optional<BlogPost> post = blogService.getPostById(id);

            if (post.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", post.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Blog post not found with id: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve blog post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Create a new blog post
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart("category") String category,
            @RequestPart("author") String author,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            BlogPost blogPost = new BlogPost();
            blogPost.setTitle(title);
            blogPost.setContent(content);
            blogPost.setCategory(category);
            blogPost.setAuthor(author);

            BlogPost savedPost = blogService.createPost(blogPost, imageFile);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", savedPost);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create blog post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update a blog post
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable Long id,
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart("category") String category,
            @RequestPart("author") String author,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            BlogPost blogPostDetails = new BlogPost();
            blogPostDetails.setTitle(title);
            blogPostDetails.setContent(content);
            blogPostDetails.setCategory(category);
            blogPostDetails.setAuthor(author);

            BlogPost updatedPost = blogService.updatePost(id, blogPostDetails, imageFile);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", updatedPost);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update blog post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Delete a blog post
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable Long id) {
        try {
            blogService.deletePost(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Blog post deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}