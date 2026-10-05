package se.comerit.avanza.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "E-post får inte vara tom")
        String email,

        @NotBlank(message = "Lösenord får inte vara tomt")
        String password
) {}