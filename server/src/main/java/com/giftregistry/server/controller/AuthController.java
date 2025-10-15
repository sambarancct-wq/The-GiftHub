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
                response.put("username", user.getUsername());
                response.put("name", user.getName());
                response.put("location", user.getLocation());
                response.put("image", user.getImage());
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

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (user.getEmail() == null || user.getPassword() == null || user.getUsername() == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Username, email and password are required.");
                return ResponseEntity.badRequest().body(response);
            }

            if (userRepository.existsByEmail(user.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email already exists.");
                return ResponseEntity.badRequest().body(response);
            }

            if (userRepository.existsByUsername(user.getUsername())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Username already exists.");
                return ResponseEntity.badRequest().body(response);
            }

            user.setName(null);
            user.setLocation(null);
            user.setImage(null);
            user.setSocialLinks(new HashMap<>());

            User savedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", savedUser.getId());
            response.put("email", savedUser.getEmail());
            response.put("username", savedUser.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error during registration.");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/users/{userId}/edit")
    public ResponseEntity<?> editProfile(@PathVariable Long userId, @RequestBody Map<String, Object> updateFields) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("Message", "User not found"));
        }

        User user = userOpt.get();

        if (updateFields.containsKey("name")) {
            user.setName((String) updateFields.get("name"));
        }
        if (updateFields.containsKey("location")) {
            user.setLocation((String) updateFields.get("location"));
        }
        if (updateFields.containsKey("image"))
            user.setImage((String) updateFields.get("image"));
        if (updateFields.containsKey("socialLinks"))
            user.setSocialLinks((Map<String, String>) updateFields.get("socialLinks"));
        
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("Message", "Profile update successfully"));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found"));
        }
        // Only allow users to fetch their own profile
        // For now, you can allow open access if there is no authentication mechanism
        User user = userOpt.get();
        // Optionally, return a DTO instead of the entity
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("location", user.getLocation());
        response.put("image", user.getImage());
        response.put("socialLinks", user.getSocialLinks());
        return ResponseEntity.ok(response);
    }

}