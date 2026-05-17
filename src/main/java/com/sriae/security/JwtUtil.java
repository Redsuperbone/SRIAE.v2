package com.sriae.security;

import com.sriae.util.RoleUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    // Cambia esta clave por una más larga y secreta
    private static final String SECRET_KEY_STRING = "mi_clave_secreta_super_larga_y_segura_2026_sriae";
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());

    // El token durará 10 horas (en milisegundos)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10;

    /**
     * Este es el método que te faltaba o que fallaba.
     * Genera el token usando el correo y el rol del usuario.
     */
    public String generateToken(String correo, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", RoleUtils.normalizeRole(rol));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(correo)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // Método para validar el token (se usa en el JwtFilter)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Obtener el correo (subject) del token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("rol", String.class);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
