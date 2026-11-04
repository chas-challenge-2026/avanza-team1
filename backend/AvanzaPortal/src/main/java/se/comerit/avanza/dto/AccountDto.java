package se.comerit.avanza.dto;

public record AccountDto(
        String name,
        String type,      // "ISK", "KF", "DEPA", "PENSION"
        double valueSek
) {}