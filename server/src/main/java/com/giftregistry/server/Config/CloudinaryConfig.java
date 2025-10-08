// src/main/java/com/giftregistry/server/config/CloudinaryConfig.java
package com.giftregistry.server.Config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        System.out.println("🔧 Initializing Cloudinary...");
        
        // Validate required properties
        if (cloudName == null || cloudName.isEmpty()) {
            throw new IllegalStateException("Cloudinary cloud name is required");
        }
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("Cloudinary API key is required");
        }
        if (apiSecret == null || apiSecret.isEmpty()) {
            throw new IllegalStateException("Cloudinary API secret is required");
        }
        
        System.out.println("   Cloud Name: " + cloudName);
        System.out.println("   API Key: " + apiKey);
        System.out.println("   API Secret: " + (apiSecret.length() > 4 ? 
            "***" + apiSecret.substring(apiSecret.length() - 4) : "invalid"));
        
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", "true");
        
        return new Cloudinary(config);
    }
}