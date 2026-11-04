package se.comerit.avanza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.comerit.avanza.entity.TargetAllocation;

import java.util.List;

// Repository for TargetAllocation entity
public interface TargetAllocationRepository extends JpaRepository<TargetAllocation, Long> {
    List<TargetAllocation> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
