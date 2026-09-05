package se.comerit.avanza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.comerit.avanza.entity.Holding;

// Repository for Holding entity
public interface HoldingRepository extends JpaRepository<Holding, Long> {
}
