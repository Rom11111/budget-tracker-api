package org.romain.budgettrackerapi.controller;

import lombok.RequiredArgsConstructor;
import org.romain.budgettrackerapi.model.Transaction;
import org.romain.budgettrackerapi.service.TransactionService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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

    // @AuthenticationPrincipal Jwt : le token décodé de l'utilisateur connecté.
    // Son "subject" contient l'email signé à la connexion.

    @GetMapping // Répond aux requêtes GET
    public List<Transaction> getAllTransactions(@AuthenticationPrincipal Jwt jwt) {

        // Récupère uniquement les transactions de l'utilisateur connecté
        return transactionService.getAllTransactions(jwt.getSubject());
    }
    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction,
                                         @AuthenticationPrincipal Jwt jwt) {

        // Enregistre la transaction au nom de l'utilisateur connecté
        return transactionService.createTransaction(transaction, jwt.getSubject());
    }
    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable Long id,
                                          @AuthenticationPrincipal Jwt jwt) {

        // Récupère une transaction grâce à son id (si elle appartient à l'utilisateur)
        return transactionService.getTransactionById(id, jwt.getSubject());
    }
    @PutMapping("/{id}")
    public Transaction updateTransaction(@PathVariable Long id,
                                         @RequestBody Transaction transaction,
                                         @AuthenticationPrincipal Jwt jwt) {

        // Modifie une transaction existante (si elle appartient à l'utilisateur)
        return transactionService.updateTransaction(id, transaction, jwt.getSubject());
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id,
                                  @AuthenticationPrincipal Jwt jwt) {

        // Supprime une transaction par son id (si elle appartient à l'utilisateur)
        transactionService.deleteTransaction(id, jwt.getSubject());
    }
}
