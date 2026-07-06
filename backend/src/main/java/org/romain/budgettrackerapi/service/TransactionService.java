package org.romain.budgettrackerapi.service;

import lombok.RequiredArgsConstructor;
import org.romain.budgettrackerapi.model.Transaction;
import org.romain.budgettrackerapi.model.User;
import org.romain.budgettrackerapi.repository.TransactionRepository;
import org.romain.budgettrackerapi.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service // Indique à Spring que cette classe contient de la logique métier
@RequiredArgsConstructor // Lombok génère le constructeur automatiquement
public class TransactionService {

    // Repositories utilisés pour accéder aux données
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    // Retourne uniquement les transactions de l'utilisateur connecté
    public List<Transaction> getAllTransactions(String userEmail) {
        return transactionRepository.findByUserEmail(userEmail);
    }

    // Sauvegarde une transaction en la rattachant à l'utilisateur connecté
    public Transaction createTransaction(Transaction transaction, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur inconnu"));

        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    // Recherche une transaction par son id, en vérifiant qu'elle appartient bien à l'utilisateur
    public Transaction getTransactionById(Long id, String userEmail) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction introuvable"));

        // Un utilisateur ne doit jamais voir les transactions d'un autre
        if (transaction.getUser() == null || !transaction.getUser().getEmail().equals(userEmail)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction introuvable");
        }
        return transaction;
    }

    // Modifie une transaction existante (si elle appartient à l'utilisateur)
    public Transaction updateTransaction(Long id, Transaction updatedTransaction, String userEmail) {
        Transaction existingTransaction = getTransactionById(id, userEmail);

        existingTransaction.setLabel(updatedTransaction.getLabel());
        existingTransaction.setAmount(updatedTransaction.getAmount());
        existingTransaction.setDate(updatedTransaction.getDate());
        existingTransaction.setCategory(updatedTransaction.getCategory());

        return transactionRepository.save(existingTransaction);
    }

    // Supprime une transaction (si elle appartient à l'utilisateur)
    public void deleteTransaction(Long id, String userEmail) {
        Transaction transaction = getTransactionById(id, userEmail);
        transactionRepository.delete(transaction);
    }
}
