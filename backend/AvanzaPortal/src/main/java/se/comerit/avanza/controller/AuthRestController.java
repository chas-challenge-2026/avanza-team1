package se.comerit.avanza.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.comerit.avanza.security.JwtService;
import se.comerit.avanza.service.AuthService;

import java.util.Map;

/**
 * REST controller responsible for authentication endpoints.
 * Used by React/frontend clients to perform login and receive a JWT token.
 * This controller does NOT render HTML views — it only returns JSON responses.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthRestController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    /**
     * POST /api/auth/login
     * Authenticates the user using email + password and returns a JWT token.
     * Frontend must send email/password as request parameters.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email,
                                   @RequestParam String password) {

        // Authenticate user using database + BCrypt
        Map<String, Object> user = authService.authenticate(email, password);

        if (user == null) {
            // Wrong credentials → return HTTP 401 Unauthorized
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // Extract userId from DB result
        Long userId = ((Number) user.get("id")).longValue();

        // Generate JWT token for the authenticated user
        String token = jwtService.generateToken(userId);

        // Return JSON response: { "token": "..." }
        return ResponseEntity.ok(Map.of("token", token));
    }
}
