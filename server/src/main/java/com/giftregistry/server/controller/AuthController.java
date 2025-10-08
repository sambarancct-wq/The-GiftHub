package com.giftregistry.server.controller;

import com.giftregistry.server.model.User;
import com.giftregistry.server.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            Optional<User> userOptional = userRepository.findByEmailAndPassword(email, password);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("userId", user.getId());
                response.put("email", user.getEmail());
                response.put("isOrganizer", user.getIsOrganizer());
                response.put("username", user.getUsername());
                return ResponseEntity.ok(response);
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (user.getEmail() == null || user.getPassword() == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email and password are required.");
                return ResponseEntity.badRequest().body(response);
            }

            if (userRepository.existsByEmail(user.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email already exists.");
                return ResponseEntity.badRequest().body(response);
            }

            User savedUser = userRepository.save(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", savedUser.getId());
            response.put("email", savedUser.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error during registration.");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/register-organizer")
    public ResponseEntity<?> registerOrganizer(@RequestBody User user) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            // Set user as organizer
            user.setIsOrganizer(true);
            User savedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Organizer registered successfully");
            response.put("userId", savedUser.getId());
            response.put("email", savedUser.getEmail());
            response.put("isOrganizer", savedUser.getIsOrganizer());
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Organizer registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Optional: Endpoint to upgrade regular user to organizer
    @PutMapping("/users/{userId}/upgrade-to-organizer")
    public ResponseEntity<?> upgradeToOrganizer(@PathVariable Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            User user = userOptional.get();
            user.setIsOrganizer(true);
            User updatedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account upgraded to organizer successfully");
            response.put("userId", updatedUser.getId());
            response.put("email", updatedUser.getEmail());
            response.put("isOrganizer", updatedUser.getIsOrganizer());
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Upgrade failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}