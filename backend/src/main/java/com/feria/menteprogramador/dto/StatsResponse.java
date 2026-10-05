package com.feria.menteprogramador.dto;

import com.feria.menteprogramador.entity.Profile;

public record StatsResponse(
        long participants,
        int averageScore,
        Profile mostCommonProfile
) {}
