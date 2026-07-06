package org.romain.budgettrackerapi.service;

import lombok.RequiredArgsConstructor;
import org.romain.budgettrackerapi.dto.AuthRequest;
import org.romain.budgettrackerapi.dto.AuthResponse;
import org.romain.budgettrackerapi.model.User;
import org.romain.budgettrackerapi.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    // Crée un compte : email unique + mot de passe haché, puis connecte directement
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un compte existe déjà avec cet email");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password())); // hash BCrypt
        userRepository.save(user);

        return new AuthResponse(generateToken(user), user.getEmail());
    }

    // Vérifie l'email et le mot de passe, renvoie un token si tout est bon
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect"));

        // matches() compare le mot de passe en clair avec le hash stocké
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect");
        }

        return new AuthResponse(generateToken(user), user.getEmail());
    }

    // Fabrique un JWT signé, valable 7 jours, dont le "subject" est l'email
    private String generateToken(User user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(user.getEmail())
                .issuedAt(now)
                .expiresAt(now.plus(7, ChronoUnit.DAYS))
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
