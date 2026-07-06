package org.romain.budgettrackerapi.repository;

import org.romain.budgettrackerapi.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Repository permettant de manipuler les transactions en base
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Toutes les transactions d'un utilisateur (via l'email du propriétaire)
    List<Transaction> findByUserEmail(String email);
}
