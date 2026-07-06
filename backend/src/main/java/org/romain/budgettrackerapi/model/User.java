package org.romain.budgettrackerapi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users") // "user" est un mot réservé en SQL, on nomme la table "users"
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Email unique : impossible de créer deux comptes avec la même adresse
    @Column(nullable = false, unique = true)
    private String email;

    // Mot de passe HACHÉ avec BCrypt — jamais stocké en clair
    @Column(nullable = false)
    private String password;
}
