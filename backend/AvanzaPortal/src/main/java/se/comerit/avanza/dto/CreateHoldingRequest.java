package se.comerit.avanza.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import se.comerit.avanza.entity.AssetCategory;

public record CreateHoldingRequest(
        @NotBlank String ticker,
        @NotBlank String instrumentName,
        @NotNull @Positive Double quantity,
        @NotNull @Positive Double avgBuyPrice,
        @NotBlank String currency,
        @NotNull AssetCategory assetCategory
) {}