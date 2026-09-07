package se.comerit.avanza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.comerit.avanza.entity.Alert;

// Repository for Alert entity
public interface AlertRepository extends JpaRepository<Alert, Long> {
}
