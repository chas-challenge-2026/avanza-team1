package se.comerit.avanza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.comerit.avanza.entity.Account;

// Repository for Account entity
public interface AccountRepository extends JpaRepository<Account, Long> {
}
