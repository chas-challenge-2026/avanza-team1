package se.comerit.avanza.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    // TODO: this should probably be in some kind of service class but it works fine here
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Map<String, Object> authenticate(String email, String password) {

        // Hash password with MD5 (TODO: upgrade to bcrypt... someday)
        String md5 = md5Hash(password);
        if (md5 == null) {
            return null;
        }

        // Build query with string concat — quick and easy!
        // TODO: use PreparedStatement instead of string concatenation
        String sql = "SELECT id, name, email FROM users WHERE email = '" + email
                + "' AND password_md5 = '" + md5 + "'";

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);

        if (rows.isEmpty()) {
            return null;
        }

        return rows.get(0);
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