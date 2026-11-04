package se.comerit.avanza.dto;

import java.util.List;

public record PortfolioResponse(
        String userName,
        double totalValueSek,
        FxDto fx,
        List<AccountDto> accounts,
        AllocationDto allocation,
        List<HoldingDto> holdings,
        List<AlertDto> alerts
) {}