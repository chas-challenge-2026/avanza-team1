package se.comerit.avanza.dto;

public record AllocationDto(
        double actualAktierPct,
        double actualStabiltPct,
        double targetAktierPct,
        double targetStabiltPct,
        double thresholdPct,
        boolean overThreshold
) {}