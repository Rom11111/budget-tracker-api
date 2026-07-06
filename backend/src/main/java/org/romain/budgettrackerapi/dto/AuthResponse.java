package org.romain.budgettrackerapi.dto;

// Ce que le serveur renvoie après une inscription ou une connexion réussie
public record AuthResponse(
        String token,
        String email
) {}
