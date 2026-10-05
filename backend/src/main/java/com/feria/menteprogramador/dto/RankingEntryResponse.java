package com.feria.menteprogramador.dto;

import com.feria.menteprogramador.entity.Profile;

public record RankingEntryResponse(
        long position,
        String alias,
        Profile profile,
        int score
) {}
