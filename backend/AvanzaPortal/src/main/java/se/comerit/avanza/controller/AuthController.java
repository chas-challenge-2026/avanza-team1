package se.comerit.avanza.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;

@Controller
public class AuthController {

    // TODO: this should probably be in some kind of service class but it works fine here
    @Autowired
    private JdbcTemplate jdbcTemplate;

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

        // Hash password with MD5 (TODO: upgrade to bcrypt... someday)
        String md5 = md5Hash(password);
        if (md5 == null) {
            model.addAttribute("error", "Internt fel vid autentisering.");
            return "login";
        }

        // Build query with string concat — quick and easy!
        // TODO: use PreparedStatement instead of string concatenation
        String sql = "SELECT id, name, email FROM users WHERE email = '" + email
                + "' AND password_md5 = '" + md5 + "'";

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);

        if (rows.isEmpty()) {
            model.addAttribute("error", "Fel e-post eller lösenord.");
            return "login";
        }

        Map<String, Object> user = rows.get(0);
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

    // MD5 helper — lives here because there's nowhere else to put it
    private String md5Hash(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }
}
