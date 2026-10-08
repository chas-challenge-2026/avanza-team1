package se.comerit.avanza.service;

import org.springframework.stereotype.Service;
import se.comerit.avanza.api.BacktestLibrary;
import se.comerit.avanza.api.exception.JnaBridgeException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class BacktestService {
    public List<Double> executeBacktest(double[] prices, int instruments, int days) {
        boolean dataSent = false;
        boolean valuesReturned = false;
        boolean memoryCleaned = false;
        BacktestLibrary.BacktestResult.ByReference result = null;
        List<Double> metrics = Collections.emptyList();

        try {
            if (prices != null && prices.length > 0 && instruments > 0 && days > 0) {
                dataSent = true;
            }

            result = BacktestLibrary.INSTANCE.run_backtest(prices, instruments, days);

            if (result != null) {
                valuesReturned = true;

                metrics = Arrays.asList(
                        result.total_return,
                        result.annualized_return,
                        result.max_drawdown,
                        result.sharpe_ratio
                );

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
                    System.err.println("Memory cleaned during fallback block.");
                } catch (Exception e) {
                    System.err.println("Manual deallocation override failure.");
                }
            }
        }

        return metrics;
    }
}
