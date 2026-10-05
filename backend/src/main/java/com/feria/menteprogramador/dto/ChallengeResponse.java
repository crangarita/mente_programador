package com.feria.menteprogramador.dto;

import java.util.UUID;

public record ChallengeResponse(
        UUID id,
        String challengeId,
        boolean success,
        int attempts,
        int elapsedSeconds
) {
}
