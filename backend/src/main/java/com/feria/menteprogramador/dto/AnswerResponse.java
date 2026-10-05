package com.feria.menteprogramador.dto;

import com.feria.menteprogramador.entity.Profile;

import java.util.Map;
import java.util.UUID;

public record AnswerResponse(
        UUID id,
        int questionNumber,
        String selectedOption,
        Profile awardedProfile,
        int points,
        Map<Profile, Integer> profileScores,
        Profile preliminaryProfile
) {
}

