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

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_category")
    private AssetCategory assetCategory;
    private Double targetPct;

    // Empty constructor required by JPA
    public TargetAllocation() {}

    // Custom constructor for manual creation

    public TargetAllocation(Long id, User user, AssetCategory assetCategory, Double targetPct) {
        this.id = id;
        this.user = user;
        this.assetCategory = assetCategory;
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

    public AssetCategory getAssetCategory() {
        return assetCategory;
    }

    public void setAssetCategory(AssetCategory assetCategory) {
        this.assetCategory = assetCategory;
    }

    public Double getTargetPct() {
        return targetPct;
    }

    public void setTargetPct(Double targetPct) {
        this.targetPct = targetPct;
    }
}
