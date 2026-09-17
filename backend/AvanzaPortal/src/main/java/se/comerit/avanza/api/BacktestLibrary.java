package se.comerit.avanza.api;

import com.sun.jna.Library;
import com.sun.jna.Native;

public interface BacktestLibrary extends Library {
    BacktestLibrary INSTANCE = Native.load("backtest", BacktestLibrary.class);

    // Maps to NativeBridgeModule* run_backtest
    NativeBridgeModule.ByReference run_backtest(
            double[] prices,
            int instruments,
            int days,
            String strategy
    );

    // Crucial: A method to free the memory allocated by C++
    void free_backtest_result(NativeBridgeModule.ByReference result);
}