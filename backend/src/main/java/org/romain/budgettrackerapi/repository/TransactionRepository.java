package org.romain.budgettrackerapi.repository;

import org.romain.budgettrackerapi.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

// Repository permettant de manipuler les transactions en base
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

}