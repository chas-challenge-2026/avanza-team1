package se.comerit.avanza.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import se.comerit.avanza.security.JwtService;
import se.comerit.avanza.service.AuthService;
import java.util.Map;

@Controller
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;


    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @GetMapping("/login")
    public String loginPage() {

        return "login";
    }

    @PostMapping("/login")
    public  ResponseEntity<?> doLogin(@RequestParam String email,
                          @RequestParam String password)
                           {
        Map<String, Object> user = authService.authenticate(email, password);

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        Long userId = ((Number) user.get("id")).longValue();
        String token = jwtService.generateToken(userId);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/logout")
    public String logout() {
        return "redirect:/login";
    }
}