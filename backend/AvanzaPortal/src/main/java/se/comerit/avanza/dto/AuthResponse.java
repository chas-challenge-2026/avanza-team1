package se.comerit.avanza.dto;

public record AuthResponse(
        UserDto user,
        String token
) {}