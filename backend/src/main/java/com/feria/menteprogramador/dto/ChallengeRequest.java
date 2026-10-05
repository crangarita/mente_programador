package com.feria.menteprogramador.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record ChallengeRequest(
        boolean success,

        @Min(value = 1, message = "Debe existir al menos un intento")
        @Max(value = 100, message = "El número de intentos no es válido")
        int attempts,

        @Min(value = 0, message = "El tiempo no puede ser negativo")
        @Max(value = 3600, message = "El tiempo no es válido")
        int elapsedSeconds
) {
}

