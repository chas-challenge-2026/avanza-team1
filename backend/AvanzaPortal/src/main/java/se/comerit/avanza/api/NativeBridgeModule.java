package se.comerit.avanza.api;

import com.sun.jna.Structure;
import java.util.Arrays;
import java.util.List;

public class NativeBridgeModule extends Structure {
    public double total_return;
    public double annualized_return;
    public double max_drawdown;
    public double sharpe_ratio;

    // Instance by Reference
    public static class ByReference extends NativeBridgeModule implements Structure.ByReference {}

    // Struct used in backtestbridge
    @Override
    protected List<String> getFieldOrder() {
        return Arrays.asList("total_return", "annualized_return", "max_drawdown", "sharpe_ratio");
    }
}