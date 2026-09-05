package se.comerit.avanza.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many alerts belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String alertType;

    @Column(columnDefinition = "TEXT")
    private String message;

    private Boolean dismissed = false;

    private LocalDateTime createdAt;

    // Empty constructor required by JPA
    public Alert() {}

    // Custom constructor for manual creation
    public Alert(User user, String alertType, String message, Boolean dismissed, LocalDateTime createdAt) {
        this.user = user;
        this.alertType = alertType;
        this.message = message;
        this.dismissed = dismissed;
        this.createdAt = createdAt;
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

    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getDismissed() {
        return dismissed;
    }

    public void setDismissed(Boolean dismissed) {
        this.dismissed = dismissed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
