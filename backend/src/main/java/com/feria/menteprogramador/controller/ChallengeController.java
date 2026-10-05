package com.feria.menteprogramador.controller;

import com.feria.menteprogramador.dto.ChallengeRequest;
import com.feria.menteprogramador.dto.ChallengeResponse;
import com.feria.menteprogramador.service.ChallengeService;
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
@RequestMapping("/api/participants/{participantId}/challenge")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeResponse save(
            @PathVariable UUID participantId,
            @Valid @RequestBody ChallengeRequest request
    ) {
        return challengeService.save(participantId, request);
    }
}

