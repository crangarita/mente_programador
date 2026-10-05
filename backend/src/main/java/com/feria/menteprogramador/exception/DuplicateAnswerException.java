package com.feria.menteprogramador.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateAnswerException extends RuntimeException {
    public DuplicateAnswerException(int questionNumber) {
        super("La pregunta " + questionNumber + " ya fue respondida");
    }
}

