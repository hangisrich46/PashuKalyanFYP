package com.pashuKalyan.controller;

import com.pashuKalyan.dto.LoginRequest;
import com.pashuKalyan.model.User;
import com.pashuKalyan.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserController {

    // Add logger
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.register(user);
            return ResponseEntity.ok().body(Map.of("message", "User registered successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)  // 409 Conflict for duplicate
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Something went wrong"));
        }
    }


    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest,
                                   HttpServletResponse httpResponse, HttpSession session) {
        boolean isAuthenticated = userService.authenticateUser(request.getEmail(), request.getPassword());

        if (isAuthenticated) {
            // First invalidate any existing session to ensure clean state
            session.invalidate();

            // Create a new session
            session = httpRequest.getSession(true);

            // Store the email in the new session
            session.setAttribute("userEmail", request.getEmail());

            // Set a cookie for additional tracking if needed
            Cookie userCookie = new Cookie("user_session", UUID.randomUUID().toString());
            userCookie.setPath("/");
            userCookie.setMaxAge(3600); // 1 hour
            httpResponse.addCookie(userCookie);

            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        // Log the current session info
        String userEmail = (String) session.getAttribute("userEmail");
        String sessionId = session.getId();
        logger.info("Logout initiated for user: {}, session ID: {}", userEmail != null ? userEmail : "unknown", sessionId);

        // Invalidate the current session
        session.invalidate();

        // Clear all cookies
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setValue("");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
                logger.info("Cleared cookie: {}", cookie.getName());
            }
        }

        // Create an empty response cookie to overwrite the JSESSIONID
        Cookie sessionCookie = new Cookie("JSESSIONID", "");
        sessionCookie.setPath("/");
        sessionCookie.setMaxAge(0);
        response.addCookie(sessionCookie);

        // Also clear any custom cookies your app might be using
        Cookie userCookie = new Cookie("user_session", "");
        userCookie.setPath("/");
        userCookie.setMaxAge(0);
        response.addCookie(userCookie);

        return ResponseEntity.ok("User logged out successfully!");
    }

    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        // 1. Check if session has user info without creating new session
        String userEmail = (String) session.getAttribute("userEmail");
        logger.debug("Checking session for user: {}", userEmail);

        if (userEmail != null) {
            logger.info("Session check successful for user: {}", userEmail);
            return ResponseEntity.ok("User is authenticated: " + userEmail);
        } else {
            // Clear any leftover cookies to be extra safe
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals("JSESSIONID")) {
                        cookie.setValue("");
                        cookie.setPath("/");
                        cookie.setMaxAge(0);
                        response.addCookie(cookie);
                        logger.info("Cleared leftover cookie: {}", cookie.getName());
                    }
                }
            }
            logger.info("Session check failed - user not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }
}