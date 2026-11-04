package se.comerit.avanza.dto;

public class BacktestMetricsDto {
    private double totalReturn;
    private double annualizedReturn;
    private double maxDrawdown;
    private double sharpeRatio;

    public BacktestMetricsDto(double totalReturn, double annualizedReturn, double maxDrawdown, double sharpeRatio) {
        this.totalReturn = totalReturn;
        this.annualizedReturn = annualizedReturn;
        this.maxDrawdown = maxDrawdown;
        this.sharpeRatio = sharpeRatio;
    }

    public double getTotalReturn() { return totalReturn; }
    public double getAnnualizedReturn() { return annualizedReturn; }
    public double getMaxDrawdown() { return maxDrawdown; }
    public double getSharpeRatio() { return sharpeRatio; }
}
