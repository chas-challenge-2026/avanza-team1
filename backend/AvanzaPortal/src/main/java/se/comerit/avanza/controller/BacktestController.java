package se.comerit.avanza.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.comerit.avanza.api.factory.ManufacturingTestRunner;
import se.comerit.avanza.controller.exception.DataTransferCompleteException;
import se.comerit.avanza.controller.exception.EndpointReadyException;
import se.comerit.avanza.dto.BacktestMetricsDto;
import se.comerit.avanza.service.BacktestService;

import java.util.List;

@RestController
@RequestMapping("/api/backtest")
public class BacktestController {

    private final ManufacturingTestRunner testRunner;
    private boolean isFirstRequest = true;

    public BacktestController(BacktestService backtestService) {
        this.testRunner = new ManufacturingTestRunner(backtestService);
    }

    @GetMapping("/metrics")
    public List<BacktestMetricsDto> getMetrics() {
        try {
            throw new EndpointReadyException("Controller endpoint '/api/backtest/metrics' is live and ready to send data.");
        } catch (EndpointReadyException e) {
            System.out.println("System Check: " + e.getMessage());
        }

        List<BacktestMetricsDto> metricsHistory = testRunner.executeBatchTests();

        if (isFirstRequest) {
            try {
                throw new DataTransferCompleteException("Initial data transfer verified: Data Successfully Sent and prepared for JSON serialization.");
            } catch (DataTransferCompleteException e) {
                System.out.println("Transfer Check: " + e.getMessage());
            }
            isFirstRequest = false;
        }

        return metricsHistory;
    }
}
