package se.comerit.avanza.entity;

public enum AssetCategory {
    EQUITY("Equity"),
    STABLE("Stable");

    private final String displayName;

    AssetCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}