package org.romain.budgettrackerapi.service;

import lombok.RequiredArgsConstructor;
import org.romain.budgettrackerapi.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.romain.budgettrackerapi.model.Transaction;
import java.util.List;

@Service // Indique à Spring que cette classe contient de la logique métier
@RequiredArgsConstructor // Lombok génère le constructeur automatiquement
public class TransactionService {

    // Repository utilisé pour accéder aux données
    private final TransactionRepository transactionRepository;

    // Retourne toutes les transactions de la base
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    // Sauvegarde une transaction dans la base
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
    // Recherche une transaction par son id
    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow();
    }
    // Modifie une transaction existante
    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow();

        existingTransaction.setLabel(updatedTransaction.getLabel());
        existingTransaction.setAmount(updatedTransaction.getAmount());
        existingTransaction.setDate(updatedTransaction.getDate());
        existingTransaction.setCategory(updatedTransaction.getCategory());

        return transactionRepository.save(existingTransaction);
    }

    // Supprime une transaction par son id
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}