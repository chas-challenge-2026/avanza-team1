package se.comerit.avanza.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class SessionSecurityFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getRequestURI();
        HttpSession session = req.getSession(false);

        // Allow public paths (open-ended)
        if (isPublicPath(path)) {
            chain.doFilter(request, response);
            return;
        }

        // Allow if user is logged in
        if (session != null && session.getAttribute("userId") != null) {
            chain.doFilter(request, response);
            return;
        }

        // Otherwise redirect to login
        res.sendRedirect("/login");
    }

    private boolean isPublicPath(String path) {
        return path.startsWith("/login")
                || path.startsWith("/logout")
                || path.startsWith("/css")
                || path.startsWith("/js")
                || path.startsWith("/images")
                || path.startsWith("/api"); // open-ended for frontend team
    }
}
