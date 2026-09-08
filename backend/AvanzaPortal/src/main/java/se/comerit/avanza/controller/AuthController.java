package se.comerit.avanza.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import se.comerit.avanza.service.AuthService;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/login")
    public String loginPage(HttpSession session, Model model) {
        // If already logged in, go home
        if (session.getAttribute("userId") != null) {
            return "redirect:/";
        }
        return "login";
    }

    @PostMapping("/login")
    public String doLogin(@RequestParam String email,
                          @RequestParam String password,
                          HttpSession session,
                          Model model) {

        Map<String, Object> user = authService.authenticate(email, password);

        if (user == null) {
            model.addAttribute("error", "Fel e-post eller lösenord.");
            return "login";
        }

        Integer userId = (Integer) user.get("id");
        String userName = (String) user.get("name");

        // Store user info in session
        session.setAttribute("userId", userId);
        session.setAttribute("userName", userName);
        session.setAttribute("userEmail", email);
        // tenantId is just userId for now, multi-tenant is future work
        session.setAttribute("tenantId", userId);

        return "redirect:/";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}