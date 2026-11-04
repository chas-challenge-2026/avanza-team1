package se.comerit.avanza.api.factory;

public class BacktestInputData {
    public double[] prices;
    public int instruments;
    public int days;

    public BacktestInputData(double[] prices, int instruments, int days) {
        this.prices = prices;
        this.instruments = instruments;
        this.days = days;
    }
}
