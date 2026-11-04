package se.comerit.avanza.dto;

public record UpdateAllocationRequest(
        double targetAktierPct,
        double targetStabiltPct
) {}