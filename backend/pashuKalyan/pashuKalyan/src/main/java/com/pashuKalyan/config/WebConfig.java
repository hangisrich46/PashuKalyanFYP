package com.pashuKalyan.config;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS configuration to allow requests from the frontend (React)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")  // Replace with your frontend URL during production
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allow required HTTP methods
                .allowedHeaders("*")  // Allow all headers (or specify specific headers)
                .allowCredentials(true);  // Add this line to allow credentials
    }
}