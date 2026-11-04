package se.comerit.avanza.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.comerit.avanza.dto.AllocationDto;
import se.comerit.avanza.dto.UpdateAllocationRequest;
import se.comerit.avanza.service.AllocationService;

@RestController
@RequestMapping("/api")
public class AllocationController {

    private final AllocationService allocationService;

    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @PutMapping("/allocation")
    public ResponseEntity<Void> saveAllocation(@RequestBody UpdateAllocationRequest request) {
        String userIdStr = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        Long userId = Long.valueOf(userIdStr);

        allocationService.saveAllocation(userId, request);
        return ResponseEntity.ok().build();
    }

}