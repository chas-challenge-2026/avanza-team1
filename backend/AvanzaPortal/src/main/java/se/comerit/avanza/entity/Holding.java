package se.comerit.avanza.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "holdings")
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many holdings belong to one account
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    private String ticker;
    private String instrumentName;

    private Double quantity;
    private Double avgBuyPrice;

    private String currency;

    // Empty constructor required by JPA
    public Holding() {}

    // Custom constructor for manual creation
    public Holding(Account account, String ticker, String instrumentName,
                   Double quantity, Double avgBuyPrice, String currency) {
        this.account = account;
        this.ticker = ticker;
        this.instrumentName = instrumentName;
        this.quantity = quantity;
        this.avgBuyPrice = avgBuyPrice;
        this.currency = currency;
    }

    // Getters & setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public String getInstrumentName() {
        return instrumentName;
    }

    public void setInstrumentName(String instrumentName) {
        this.instrumentName = instrumentName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getAvgBuyPrice() {
        return avgBuyPrice;
    }

    public void setAvgBuyPrice(Double avgBuyPrice) {
        this.avgBuyPrice = avgBuyPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
