package se.comerit.avanza.service;

import org.springframework.stereotype.Service;
import se.comerit.avanza.api.BacktestLibrary;
import se.comerit.avanza.api.exception.JnaBridgeException;
import se.comerit.avanza.dto.BacktestMetricsDto;

@Service
public class BacktestService {

    public BacktestMetricsDto executeBacktest(double[] prices, int instruments, int days, String currency) {
        boolean dataSent = false;
        boolean valuesReturned = false;
        boolean memoryCleaned = false;
        BacktestLibrary.BacktestResult.ByReference result = null;

        BacktestMetricsDto metrics = null;

        try {
            if (prices != null && currency != null && prices.length > 0 && instruments > 0 && days >= 3) {
                if (prices.length != instruments * days) {
                    throw new IllegalArgumentException(
                            "prices.length (" + prices.length + ") doesn't match instruments * days (" + (instruments * days) + ")"
                    );
                }
                dataSent = true;
            }

            if (dataSent) {
                result = BacktestLibrary.INSTANCE.run_backtest(prices, instruments, days, currency);

                if (result != null) {
                    valuesReturned = true;

                    metrics = new BacktestMetricsDto(
                            result.total_return,
                            result.annualized_return,
                            result.max_drawdown,
                            result.sharpe_ratio,
                            result.currency
                    );
                }

                BacktestLibrary.INSTANCE.free_backtest_result(result.getPointer());
                memoryCleaned = true;
            }

            JnaBridgeException.evaluateBridgeState(dataSent, valuesReturned, memoryCleaned);
        } catch (JnaBridgeException e) {
            System.err.println(e.getMessage());
        } catch (Exception e) {
            System.err.println("Systemic failure: " + e.getMessage());
        } finally {
            if (!memoryCleaned && result != null && result.getPointer() != null) {
                try {
                    BacktestLibrary.INSTANCE.free_backtest_result(result.getPointer());
                    memoryCleaned = true;
                    System.err.println("Memory cleaned during fallback block.");
                } catch (Exception e) {
                    System.err.println("Manual deallocation override failure.");
                }
            }
        }

        return metrics;
    }
}
