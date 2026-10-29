package se.comerit.avanza.api.factory;

public class BacktestInputData {
    public double[] prices;
    public int instruments;
    public int days;
    public String currency;

    public BacktestInputData(double[] prices, int instruments, int days, String currency) {
        this.prices = prices;
        this.instruments = instruments;
        this.days = days;
        this.currency = currency;
    }
}
