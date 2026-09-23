package se.comerit.avanza.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

/**
 * JwtService handles creation, validation and extraction of JWT tokens.
 * Used by Spring Security (v2) together with JwtAuthenticationFilter.
 */
@Service
public class JwtService {

    // Secret key used to sign and validate JWT tokens
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    /**
     * Generate a JWT token containing the userId as the subject.
     * Token is valid for 1 hour.
     */
    public String generateToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))          // store userId inside the token
                .setIssuedAt(new Date())                    // token creation time
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(key)                              // sign token with secret key
                .compact();
    }

    /**
     * Extract JWT token from Authorization header (Bearer <token>).
     * Returns null if header is missing or incorrectly formatted.
     */
    public String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        return authHeader.substring(7); // remove "Bearer "
    }

    /**
     * Validate the token and return the userId stored inside the JWT.
     * Used when you need the actual userId (e.g., login).
     */
    public Long validateToken(String token) {
        var claims = Jwts.parserBuilder()
                .setSigningKey(key)                         // same key used for signing
                .build()
                .parseClaimsJws(token)                      // verify token signature + expiration
                .getBody();

        return Long.valueOf(claims.getSubject());           // extract userId
    }

    /**
     * Validate the token by verifying its signature and expiration.
     * Returns true if token is valid, false otherwise.
     */
    public boolean isValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token); // verifies signature + expiration

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extract userId from JWT claims.
     * Used by Spring Security to set the authenticated principal.
     */
    public String getUserId(String token) {
        var claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject(); // userId stored in subject
    }
}
