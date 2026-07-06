package org.romain.budgettrackerapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

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
}