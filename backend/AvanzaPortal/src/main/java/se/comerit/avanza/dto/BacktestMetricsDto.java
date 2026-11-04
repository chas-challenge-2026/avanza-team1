package se.comerit.avanza.dto;

public class BacktestMetricsDto {
    private double totalReturn;
    private double annualizedReturn;
    private double maxDrawdown;
    private double sharpeRatio;
    private String currency;

    public BacktestMetricsDto(double totalReturn, double annualizedReturn, double maxDrawdown, double sharpeRatio, String currency) {
        this.totalReturn = totalReturn;
        this.annualizedReturn = annualizedReturn;
        this.maxDrawdown = maxDrawdown;
        this.sharpeRatio = sharpeRatio;
        this.currency = currency;
    }

    public double getTotalReturn() { return totalReturn; }
    public double getAnnualizedReturn() { return annualizedReturn; }
    public double getMaxDrawdown() { return maxDrawdown; }
    public double getSharpeRatio() { return sharpeRatio; }
    public String getCurrency() { return currency; }
}
