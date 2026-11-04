package se.comerit.avanza.dto;

public record HoldingDto(
        String ticker,
        String name,
        String account,     // "ISK", "KF", etc.
        double quantity,
        String currency,    // "SEK", "USD", "EUR"
        double valueSek,
        double returnPct,
        String assetClass   // "AKTIER", "STABILT"
) {}