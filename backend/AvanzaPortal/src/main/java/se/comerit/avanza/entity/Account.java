package se.comerit.avanza.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many accounts belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String accountType;
    private String accountName;
    private String currency;

    // One account can have many holdings
    @OneToMany(mappedBy = "account")
    private List<Holding> holdings;

    // Empty constructor required by JPA
    public Account() {}

    // Custom constructor for manual creation
    public Account(User user, String accountType, String accountName, String currency) {
        this.user = user;
        this.accountType = accountType;
        this.accountName = accountName;
        this.currency = currency;
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

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public List<Holding> getHoldings() {
        return holdings;
    }

    public void setHoldings(List<Holding> holdings) {
        this.holdings = holdings;
    }
}
