package se.comerit.avanza.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "target_allocations")
public class TargetAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many target allocations belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String accountType;
    private Double targetPct;

    // Empty constructor required by JPA
    public TargetAllocation() {}

    // Custom constructor for manual creation
    public TargetAllocation(User user, String accountType, Double targetPct) {
        this.user = user;
        this.accountType = accountType;
        this.targetPct = targetPct;
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

    public Double getTargetPct() {
        return targetPct;
    }

    public void setTargetPct(Double targetPct) {
        this.targetPct = targetPct;
    }
}
