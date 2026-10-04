package se.comerit.avanza.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.comerit.avanza.dto.AuthResponse;
import se.comerit.avanza.dto.LoginRequest;
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
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        var userDto = authService.authenticateUser(request.email(), request.password());

        if (userDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        Long userId = Long.valueOf(userDto.id());
        String token = jwtService.generateToken(userId);

        return ResponseEntity.ok(new AuthResponse(userDto, token));
    }
}
