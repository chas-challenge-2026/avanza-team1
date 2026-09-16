package se.comerit.avanza.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "backtest_histories")
public class BacktestHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many backtest records belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Input parameters used for the C++ backtest
    private String strategy;
    private Integer days;
    private Integer instruments;

    // Output metrics calculated by the C++ engine
    private Double totalReturn;
    private Double annualizedReturn;
    private Double maxDrawdown;
    private Double sharpeRatio;

    // Timestamp of execution
    private LocalDateTime runAt;

    public BacktestHistory() {}

    // Custom constructor for manual creation
    public BacktestHistory(User user, String strategy, Integer days, Integer instruments,
                           Double totalReturn, Double annualizedReturn,
                           Double maxDrawdown, Double sharpeRatio, LocalDateTime runAt) {
        this.user = user;
        this.strategy = strategy;
        this.days = days;
        this.instruments = instruments;
        this.totalReturn = totalReturn;
        this.annualizedReturn = annualizedReturn;
        this.maxDrawdown = maxDrawdown;
        this.sharpeRatio = sharpeRatio;
        this.runAt = runAt;
    }

    // Getters & setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getStrategy() {
        return strategy;
    }

    public void setStrategy(String strategy) {
        this.strategy = strategy;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public Integer getInstruments() {
        return instruments;
    }

    public void setInstruments(Integer instruments) {
        this.instruments = instruments;
    }

    public Double getTotalReturn() {
        return totalReturn;
    }

    public void setTotalReturn(Double totalReturn) {
        this.totalReturn = totalReturn;
    }

    public Double getAnnualizedReturn() {
        return annualizedReturn;
    }

    public void setAnnualizedReturn(Double annualizedReturn) {
        this.annualizedReturn = annualizedReturn;
    }

    public Double getMaxDrawdown() {
        return maxDrawdown;
    }

    public void setMaxDrawdown(Double maxDrawdown) {
        this.maxDrawdown = maxDrawdown;
    }

    public Double getSharpeRatio() {
        return sharpeRatio;
    }

    public void setSharpeRatio(Double sharpeRatio) {
        this.sharpeRatio = sharpeRatio;
    }

    public LocalDateTime getRunAt() {
        return runAt;
    }

    public void setRunAt(LocalDateTime runAt) {
        this.runAt = runAt;
    }
}