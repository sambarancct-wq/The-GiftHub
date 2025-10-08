// src/main/java/com/giftregistry/server/service/ImageService.java
package com.giftregistry.server.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
            ObjectUtils.asMap(
                "folder", "gift-registry",
                "use_filename", true,
                "unique_filename", false,
                "overwrite", true
            ));

        return (String) uploadResult.get("secure_url"); // Returns HTTPS URL
    }

    public boolean deleteImage(String imageUrl) {
        try {
            if (imageUrl == null || imageUrl.isEmpty()) {
                return true;
            }

            // Extract public_id from URL
            String publicId = extractPublicIdFromUrl(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
            return true;
        } catch (Exception e) {
            System.err.println("Error deleting image from Cloudinary: " + e.getMessage());
            return false;
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            // Cloudinary URL format: https://res.cloudinary.com/cloudname/image/upload/v1234567/folder/filename.jpg
            String[] parts = imageUrl.split("/upload/");
            if (parts.length > 1) {
                String path = parts[1];
                // Remove version if present
                if (path.startsWith("v")) {
                    path = path.substring(path.indexOf('/') + 1);
                }
                // Remove file extension
                int lastDot = path.lastIndexOf('.');
                if (lastDot != -1) {
                    path = path.substring(0, lastDot);
                }
                return path;
            }
        } catch (Exception e) {
            System.err.println("Error extracting public ID from URL: " + imageUrl);
        }
        return null;
    }
}