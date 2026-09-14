package se.comerit.avanza.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    // TODO: this should probably be in some kind of service class but it works fine here
    private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(JdbcTemplate jdbcTemplate, BCryptPasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> authenticate(String email, String rawPassword) {

        // Fix SQL‑injektion: parametrized SQL query
        // Parametrized SQL: '?' = placeholders that only accept safe text values.
        // jdbcTemplate fills the placeholders securely, preventing SQL injection.
        String sql = "SELECT id, name, email, password_bcrypt FROM users WHERE email = ? ";
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, email);


        if (rows.isEmpty()) {
            return null;
        }

        Map<String, Object> user = rows.get(0);

        // Hämta BCrypt-hashen från databasen
        String storedHash = (String) user.get("password_bcrypt");

        // Jämför lösenordet med BCrypt
        if (passwordEncoder.matches(rawPassword, storedHash)) {
            return user;
        }

        return null;
    }


}