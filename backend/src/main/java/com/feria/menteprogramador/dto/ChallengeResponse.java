package com.feria.menteprogramador.dto;

import java.util.UUID;

public record ChallengeResponse(
        UUID id,
        boolean success,
        int attempts,
        int elapsedSeconds
) {
}

