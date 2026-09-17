package se.comerit.avanza.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // Hemlig nyckel för att signera JWT
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Skapa JWT-token
    public String generateToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))          // lägger userId i token
                .setIssuedAt(new Date())                    // när token skapades
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 timme
                .signWith(key)                              // signera token
                .compact();                                 // skapa strängen
    }

    // Verifiera JWT-token och hämta userId
    public Long validateToken(String token) {
        var claims = Jwts.parserBuilder()
                .setSigningKey(key)                         // samma nyckel som vid skapande
                .build()
                .parseClaimsJws(token)                      // verifiera token
                .getBody();

        return Long.valueOf(claims.getSubject());           // plocka ut userId
    }
}
