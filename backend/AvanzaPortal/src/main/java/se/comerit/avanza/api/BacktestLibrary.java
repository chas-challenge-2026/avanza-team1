package se.comerit.avanza.api;

import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.Structure;

import java.util.Arrays;
import java.util.List;

public interface BacktestLibrary extends Library {
    BacktestLibrary INSTANCE = Native.load("backtest", BacktestLibrary.class);

    // Maps to NativeBridgeModule* run_backtest
    class BacktestResult extends Structure {
        public double total_return;
        public double annualized_return;
        public double max_drawdown;
        public double sharpe_ratio;
        public String currency;

        @Override
        protected List<String> getFieldOrder() {
            return Arrays.asList("total_return", "annualized_return", "max_drawdown", "sharpe_ratio", "currency");
        }

        public static class ByReference extends BacktestResult implements Structure.ByReference {}
    }


    BacktestResult.ByReference run_backtest(double[] prices, int instruments, int days, String currency);
    // Crucial: A method to free the memory allocated by C++
    void free_backtest_result(Pointer result);
}