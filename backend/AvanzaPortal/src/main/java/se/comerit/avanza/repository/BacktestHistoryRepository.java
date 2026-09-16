package se.comerit.avanza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.comerit.avanza.entity.BacktestHistory;

// Repository for BacktestHistory entity
public interface BacktestHistoryRepository extends JpaRepository<BacktestHistory, Long> {
}
