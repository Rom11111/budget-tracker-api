package org.romain.budgettrackerapi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Ce que le client envoie pour s'inscrire ou se connecter
public record AuthRequest(

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "L'email n'est pas valide")
        String email,

        @NotBlank(message = "Le mot de passe est obligatoire")
        @Size(min = 8, message = "Le mot de passe doit faire au moins 8 caractères")
        String password
) {}
