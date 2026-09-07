package se.comerit.avanza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.comerit.avanza.entity.TargetAllocation;

// Repository for TargetAllocation entity
public interface TargetAllocationRepository extends JpaRepository<TargetAllocation, Long> {
}
