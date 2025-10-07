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
    public ResponseEntity<?> validateUser(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Please provide both email and password.");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<User> user = userRepository.findByEmailAndPassword(email, password);
            if (!user.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Invalid credentials.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("userId", user.get().getId());
            response.put("email", user.get().getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "An error occurred during the login process.");
            response.put("error", e.getMessage());
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
}