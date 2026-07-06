package org.romain.budgettrackerapi.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class SecurityConfig {

    // Clé secrète qui signe les tokens (définie dans application.properties).
    // Quiconque possède cette clé peut fabriquer des tokens : à protéger en production !
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Règles d'accès de l'API
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Pas de cookies de session : chaque requête porte son token (API stateless)
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // S'inscrire et se connecter : accessibles sans token
                        .requestMatchers("/api/auth/**").permitAll()
                        // Page d'erreur interne de Spring : sans ça, un 409 ou 404
                        // levé dans un controller se transformerait en 401
                        .requestMatchers("/error").permitAll()
                        // Tout le reste exige un token JWT valide
                        .anyRequest().authenticated()
                )
                // Active la vérification automatique du header "Authorization: Bearer <token>"
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    // Algorithme de hash des mots de passe
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Signe les tokens à la connexion
    @Bean
    public JwtEncoder jwtEncoder() {
        SecretKey key = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return new NimbusJwtEncoder(new ImmutableSecret<>(key));
    }

    // Vérifie la signature des tokens sur chaque requête
    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKey key = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
    }
}
