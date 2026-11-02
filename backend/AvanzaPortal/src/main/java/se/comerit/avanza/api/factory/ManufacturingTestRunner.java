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

        // Mock Data
        batch.add(new BacktestInputData(new double[]{150.25, 152.10, 149.80, 155.00}, 1, 4, "SEK"));

        batch.add(new BacktestInputData(new double[]{120.50, 122.00, 121.25, 124.80, 126.40, 125.90}, 1, 6, "SEK"));

        batch.add(new BacktestInputData(new double[]{ 85.0, 87.5, 86.2, 89.0, 91.5, 90.8, 150.0, 148.5, 152.0, 155.5, 154.0, 158.0 }, 2, 6, "SEK" ));

        batch.add(new BacktestInputData(new double[]{ 50.0, 52.0, 51.5, 54.0, 55.5, 200.0, 198.0, 202.5, 205.0, 207.5, 75.0, 74.5, 76.0, 78.5, 80.0 }, 3, 5, "SEK" ));

        batch.add(new BacktestInputData(new double[]{10.5, 11.2, 10.8, 11.5, 12.0, 11.9, 12.5, 13.0, 12.8, 13.5}, 2, 5, "SEK"));

        batch.add(new BacktestInputData( new double[]{ 300.0, 295.0, 302.0, 310.0, 308.0, 315.0, 320.0, 45.0, 46.5, 44.0, 47.5, 49.0, 48.5, 51.0 }, 2, 7, "SEK" ));

        batch.add(new BacktestInputData( new double[]{ 500.0, 510.0, 505.0, 515.0, 520.0, 518.0, 530.0, 540.0 }, 1, 8, "SEK" ));

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
