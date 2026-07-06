package org.romain.budgettrackerapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.romain.budgettrackerapi.dto.AuthRequest;
import org.romain.budgettrackerapi.dto.AuthResponse;
import org.romain.budgettrackerapi.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth") // Routes publiques : pas besoin de token ici
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED) // 201 : ressource créée
    public AuthResponse register(@Valid @RequestBody AuthRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }
}
