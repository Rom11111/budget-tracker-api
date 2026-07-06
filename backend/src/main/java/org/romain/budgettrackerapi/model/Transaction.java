package org.romain.budgettrackerapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity // Indique que cette classe deviendra une table en base de données
@Getter // Génère automatiquement les getters
@Setter // Génère automatiquement les setters
@NoArgsConstructor // Génère un constructeur vide
@AllArgsConstructor // Génère un constructeur avec tous les champs
public class Transaction {

    @Id // Clé primaire de la table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID généré automatiquement
    private Long id;

    // Nom de la transaction : exemple "Courses", "Salaire", "Netflix"
    private String label;

    // Montant de la transaction
    private BigDecimal amount;

    // Date de la transaction
    private LocalDate date;

    // Catégorie : exemple "alimentation", "transport", "salaire"
    private String category;

    // Propriétaire : plusieurs transactions appartiennent à un utilisateur.
    // @JsonIgnore : on ne renvoie jamais l'utilisateur (et son hash) dans le JSON.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}