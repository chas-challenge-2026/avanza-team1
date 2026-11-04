package se.comerit.avanza.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String passwordMd5;

    // One user can have many accounts
    @OneToMany(mappedBy = "user")
    private List<Account> accounts;

    // One user can have many alerts
    @OneToMany(mappedBy = "user")
    private List<Alert> alerts;

    // One user can have many target allocations
    @OneToMany(mappedBy = "user")
    private List<TargetAllocation> targetAllocations;

    // Empty constructor required by JPA
    public User() {}

    // Custom constructor for manual creation
    public User(String name, String email, String passwordMd5) {
        this.name = name;
        this.email = email;
        this.passwordMd5 = passwordMd5;
    }

    // Getters & setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordMd5() {
        return passwordMd5;
    }

    public void setPasswordMd5(String passwordMd5) {
        this.passwordMd5 = passwordMd5;
    }

    public List<Account> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<Account> accounts) {
        this.accounts = accounts;
    }

    public List<Alert> getAlerts() {
        return alerts;
    }

    public void setAlerts(List<Alert> alerts) {
        this.alerts = alerts;
    }

    public List<TargetAllocation> getTargetAllocations() {
        return targetAllocations;
    }

    public void setTargetAllocations(List<TargetAllocation> targetAllocations) {
        this.targetAllocations = targetAllocations;
    }
}
