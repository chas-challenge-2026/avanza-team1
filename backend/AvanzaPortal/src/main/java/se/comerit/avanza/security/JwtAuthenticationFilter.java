package se.comerit.avanza.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter implements Filter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getRequestURI();

        // Public endpoints (ingen JWT krävs)
        if (path.equals("/login") ||
                path.equals("/logout") ||
                path.startsWith("/css") ||
                path.startsWith("/js") ||
                path.startsWith("/images")) {

            chain.doFilter(request, response);
            return;
        }

        // Läs Authorization-header
        String authHeader = req.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            res.setStatus(401);
            return;
        }

        String token = authHeader.substring(7);

        try {
            Long userId = jwtService.validateToken(token);

            // Lägg userId i request så controllers kan använda det
            req.setAttribute("userId", userId);

            chain.doFilter(request, response);

        } catch (Exception e) {
            res.setStatus(401);
            return;
        }
    }
}
