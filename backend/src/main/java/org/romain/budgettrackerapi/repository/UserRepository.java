package org.romain.budgettrackerapi.repository;

import org.romain.budgettrackerapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data génère la requête à partir du nom de la méthode
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
