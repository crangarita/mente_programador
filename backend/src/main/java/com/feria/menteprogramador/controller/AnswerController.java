package com.feria.menteprogramador.controller;

import com.feria.menteprogramador.dto.AnswerRequest;
import com.feria.menteprogramador.dto.AnswerResponse;
import com.feria.menteprogramador.service.AnswerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/participants/{participantId}/answers")
public class AnswerController {

    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AnswerResponse save(
            @PathVariable UUID participantId,
            @Valid @RequestBody AnswerRequest request
    ) {
        return answerService.save(participantId, request);
    }
}

