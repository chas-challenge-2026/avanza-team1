package se.comerit.avanza.dto;

import java.time.LocalDate;

public record DailyPriceDto(
        LocalDate date,
        double open,
        double high,
        double low,
        double close,
        long volume
) {}
