package com.feria.menteprogramador.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AnswerRequest(
        @Min(value = 1, message = "La pregunta debe estar entre 1 y 5")
        @Max(value = 5, message = "La pregunta debe estar entre 1 y 5")
        int questionNumber,

        @NotBlank(message = "La opción es obligatoria")
        @Pattern(regexp = "^[A-Fa-f]$", message = "La opción debe estar entre A y F")
        String selectedOption
) {
    public AnswerRequest {
        selectedOption = selectedOption == null ? null : selectedOption.toUpperCase();
    }
}

