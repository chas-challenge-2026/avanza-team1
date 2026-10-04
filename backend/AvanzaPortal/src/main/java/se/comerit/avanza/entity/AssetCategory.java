package se.comerit.avanza.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum AssetCategory {
    EQUITY("Equity"),
    STABLE("Stable");

    private final String displayName;

    AssetCategory(String displayName) {
        this.displayName = displayName;
    }

    // @JsonValue gör att Jackson automatiskt serialiserar EQUITY till "AKTIER" i JSON
    @JsonValue
    public String getDisplayName() {
        return displayName;
    }
}