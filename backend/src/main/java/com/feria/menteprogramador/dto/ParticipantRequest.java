package com.feria.menteprogramador.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ParticipantRequest(
        @NotBlank(message = "El alias es obligatorio")
        @Size(min = 2, max = 30, message = "El alias debe tener entre 2 y 30 caracteres")
        @Pattern(regexp = "^[^\\p{Cc}<>]+$", message = "El alias contiene caracteres no permitidos")
        String alias
) {
    public ParticipantRequest {
        alias = alias == null ? null : alias.trim();
    }
}
