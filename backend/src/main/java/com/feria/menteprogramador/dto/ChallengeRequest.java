package com.feria.menteprogramador.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ChallengeRequest(
        @NotBlank(message = "El reto es obligatorio")
        String challengeId,

        @NotEmpty(message = "Agrega al menos un comando")
        @Size(max = 30, message = "La secuencia es demasiado larga")
        List<String> commands,

        @Min(value = 1, message = "Debe existir al menos un intento")
        @Max(value = 100, message = "El número de intentos no es válido")
        int attempts,

        @Min(value = 0, message = "El tiempo no puede ser negativo")
        @Max(value = 3_600_000, message = "El tiempo no es válido")
        long elapsedMilliseconds
) {
}
