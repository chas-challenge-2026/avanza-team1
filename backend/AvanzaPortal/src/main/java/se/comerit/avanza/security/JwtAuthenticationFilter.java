package se.comerit.avanza.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JwtAuthenticationFilter integrates JWT authentication into Spring Security.
 * It extracts the token, validates it and registers the authenticated user
 * inside the SecurityContext for the current request.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Extract JWT from Authorization header
        String token = jwtService.extractToken(request);

        // Validate token and set authentication context
        if (token != null && jwtService.isValid(token)
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Read userId from JWT claims
            String userId = jwtService.getUserId(token);

            // Create authentication object (stateless)
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userId, null, List.of());

            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Register authenticated user in SecurityContext
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }
}
