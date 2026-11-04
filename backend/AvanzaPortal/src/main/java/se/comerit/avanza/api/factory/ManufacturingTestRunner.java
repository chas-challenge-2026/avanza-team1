package se.comerit.avanza.api.factory;

import se.comerit.avanza.dto.BacktestMetricsDto;
import se.comerit.avanza.service.BacktestService;

import java.util.ArrayList;
import java.util.List;

public class ManufacturingTestRunner {

    private final BacktestService backtestService;

    public ManufacturingTestRunner(BacktestService backtestService) {
        this.backtestService = backtestService;
    }

    public List<BacktestInputData> generateTestBatch() {
        List<BacktestInputData> batch = new ArrayList<>();

        batch.add(new BacktestInputData(new double[]{150.25, 152.10, 149.80, 155.00}, 1, 4));

        batch.add(new BacktestInputData(new double[]{10.5, 11.2, 10.8, 11.5, 12.0, 11.9, 12.5, 13.0, 12.8, 13.5}, 2, 10));

        batch.add(new BacktestInputData(new double[]{200.0, 195.5, 190.0, 185.5, 180.0}, 1, 5));

        return batch;
    }

    public List<BacktestMetricsDto> executeBatchTests() {
        List<BacktestInputData> testBatch = generateTestBatch();
        List<BacktestMetricsDto> batchResults = new ArrayList<>();

        for (BacktestInputData input : testBatch) {
            List<Double> rawMetrics = backtestService.executeBacktest(input.prices, input.instruments, input.days);

            if (rawMetrics != null && rawMetrics.size() == 4) {
                batchResults.add(new BacktestMetricsDto(
                        rawMetrics.get(0),
                        rawMetrics.get(1),
                        rawMetrics.get(2),
                        rawMetrics.get(3)
                ));
            }
        }

        return batchResults;
    }
}
