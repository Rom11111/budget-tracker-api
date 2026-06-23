package org.romain.budgettrackerapi.controller;

import lombok.RequiredArgsConstructor;
import org.romain.budgettrackerapi.model.Transaction;
import org.romain.budgettrackerapi.service.TransactionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController // Indique que cette classe expose des endpoints REST
@RequestMapping("/api/transactions") // URL de base du controller
@RequiredArgsConstructor // Génère le constructeur automatiquement
public class TransactionController {

    // Service contenant la logique métier
    private final TransactionService transactionService;

    @GetMapping // Répond aux requêtes GET
    public List<Transaction> getAllTransactions() {

        // Appelle le service pour récupérer toutes les transactions
        return transactionService.getAllTransactions();
    }
    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {

        // Enregistre la transaction en base
        return transactionService.createTransaction(transaction);
    }
    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable Long id) {

        // Récupère une transaction grâce à son id
        return transactionService.getTransactionById(id);
    }
    @PutMapping("/{id}")
    public Transaction updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction) {

        // Modifie une transaction existante
        return transactionService.updateTransaction(id, transaction);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {

        // Supprime une transaction par son id
        transactionService.deleteTransaction(id);
    }
}