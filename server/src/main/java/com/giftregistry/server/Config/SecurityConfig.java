package com.giftregistry.server.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @SuppressWarnings("deprecation")
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                corsConfig.addAllowedOrigin("http://localhost:3000");
                corsConfig.addAllowedMethod("*");
                corsConfig.addAllowedHeader("*");
                corsConfig.setAllowCredentials(true);
                return corsConfig;
            }))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API endpoints
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(
                    new AntPathRequestMatcher("/api/login"),
                    new AntPathRequestMatcher("/api/register"),
                    new AntPathRequestMatcher("/api/register-organizer"),
                    new AntPathRequestMatcher("/api/gifts"),
                    new AntPathRequestMatcher("/api/gifts/**"),
                    new AntPathRequestMatcher("/api/events"),
                    new AntPathRequestMatcher("/api/events/**"),
                    new AntPathRequestMatcher("/api/events/public"),
                    new AntPathRequestMatcher("/api/users"),
                    new AntPathRequestMatcher("/api/users/**"),
                    new AntPathRequestMatcher("/api/rsvp/**"),
                    new AntPathRequestMatcher("/api/event/**"),
                    new AntPathRequestMatcher("/api/users/**")
                ).permitAll() // Allow all API endpoints without authentication
                .anyRequest().authenticated() // All other requests need authentication
            );
        
        return http.build();
    }
}