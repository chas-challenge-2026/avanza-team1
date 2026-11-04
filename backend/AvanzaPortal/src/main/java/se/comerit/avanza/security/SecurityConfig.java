package se.comerit.avanza.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Central security configuration for backend (v2).
 * Defines SecurityFilterChain, integrates JWT authentication and replaces all
 * previous session-based security logic. Handles which endpoints are public
 * and which require a valid token. Forms the basis for a modern, stateless
 * and scalable security architecture.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 1. Enable CORS with customized configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Disable CSRF (not required for stateless JWT REST APIs)
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        // Allow unauthenticated access to authentication REST endpoints
                        .requestMatchers("/","/api/auth/**", "/api/backtest/**").permitAll()
                        // Require JWT authentication for all other endpoints
                        // !! Opening all Endpoints to make it easier to help all teams in developing further
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS configuration allowing the React frontend (localhost:5173)
     * to access REST endpoints without browser cross-origin blocking.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow React Vite development server
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Allow necessary HTTP methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow standard headers and Authorization header for JWT tokens
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));

        // Allow credentials/cookies if required
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}