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

        // 1 instrument * 4 days = 4 prices
        batch.add(new BacktestInputData(new double[]{150.25, 152.10, 149.80, 155.00}, 1, 4, "SEK"));

        // 2 instrument * 5 days = 10 prices
        batch.add(new BacktestInputData(new double[]{10.5, 11.2, 10.8, 11.5, 12.0, 11.9, 12.5, 13.0, 12.8, 13.5}, 2, 5, "SEK"));

        // 1 instrument * 5 days = 5 prices
        batch.add(new BacktestInputData(new double[]{200.0, 195.5, 190.0, 185.5, 180.0}, 1, 5, "SEK"));

        return batch;
    }

    public List<BacktestMetricsDto> executeBatchTests() {
        List<BacktestInputData> testBatch = generateTestBatch();
        List<BacktestMetricsDto> batchResults = new ArrayList<>();

        for (BacktestInputData input : testBatch) {
            BacktestMetricsDto metrics = backtestService.executeBacktest(
                    input.prices,
                    input.instruments,
                    input.days,
                    input.currency
            );

            if (metrics != null) {
                batchResults.add(metrics);
            }
        }

        return batchResults;
    }
}
