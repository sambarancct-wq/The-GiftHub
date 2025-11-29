package com.giftregistry.server.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Setup CORS to use the configuration defined below
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 2. Disable CSRF (standard for stateless REST APIs)
            .csrf(csrf -> csrf.disable())
            // 3. Define Public Endpoints
            .authorizeHttpRequests(authz -> authz
                // CRITICAL: Allow Root URL for Render Health Checks
                .requestMatchers("/").permitAll()
                // Allow your existing API endpoints
                .requestMatchers(
                    "/api/login",
                    "/api/register",
                    "/api/register-organizer",
                    "/api/gifts/**",
                    "/api/events/**",
                    "/api/users/**",
                    "/api/rsvp/**"
                ).permitAll()
                // Lock everything else
                .anyRequest().authenticated()
            );
        
        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // --- DYNAMIC FRONTEND URL SETUP ---
        // 1. Get the URL from Render Environment
        String frontendUrl = System.getenv("FRONTEND_URL");
        
        // 2. If running locally (variable is null), default to localhost
        if (frontendUrl == null || frontendUrl.isEmpty()) {
            frontendUrl = "http://localhost:3000";
        }

        // 3. Allow BOTH the Render URL and Localhost (for easier testing)
        configuration.setAllowedOrigins(Arrays.asList(frontendUrl, "http://localhost:3000"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
