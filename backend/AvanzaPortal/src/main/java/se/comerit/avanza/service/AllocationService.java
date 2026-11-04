package se.comerit.avanza.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import se.comerit.avanza.dto.AllocationDto;
import se.comerit.avanza.dto.UpdateAllocationRequest;
import se.comerit.avanza.entity.AssetCategory;
import se.comerit.avanza.entity.TargetAllocation;
import se.comerit.avanza.entity.User;
import se.comerit.avanza.repository.TargetAllocationRepository;
import se.comerit.avanza.repository.UserRepository;

@Service
public class AllocationService {

    private final TargetAllocationRepository targetAllocationRepository;
    private final UserRepository userRepository;

    public AllocationService(TargetAllocationRepository targetAllocationRepository, UserRepository userRepository) {
        this.targetAllocationRepository = targetAllocationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void saveAllocation(Long userId, UpdateAllocationRequest request) {
        // Ta bort befintliga mål
        targetAllocationRepository.deleteByUserId(userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Spara mål för Aktier (EQUITY)
        TargetAllocation equityTarget = new TargetAllocation();
        equityTarget.setUser(user);
        equityTarget.setAssetCategory(AssetCategory.EQUITY);
        equityTarget.setTargetPct(request.targetAktierPct());
        targetAllocationRepository.save(equityTarget);

        // Spara mål för Stabilt (STABLE)
        TargetAllocation stableTarget = new TargetAllocation();
        stableTarget.setUser(user);
        stableTarget.setAssetCategory(AssetCategory.STABLE);
        stableTarget.setTargetPct(request.targetStabiltPct());
        targetAllocationRepository.save(stableTarget);
    }
}