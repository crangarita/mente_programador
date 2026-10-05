package com.feria.menteprogramador.dto;

import com.feria.menteprogramador.entity.Profile;

public record FinalResultResponse(
        String alias,
        Profile profile,
        int testScore,
        int challengeScore,
        int score,
        long rankingPosition
) {}
