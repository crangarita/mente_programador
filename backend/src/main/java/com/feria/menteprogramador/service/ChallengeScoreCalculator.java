package com.feria.menteprogramador.service;

import com.feria.menteprogramador.entity.ChallengeResult;
import org.springframework.stereotype.Component;

@Component
public class ChallengeScoreCalculator {
    private static final int SUCCESS_POINTS = 400;
    private static final int MAX_SPEED_POINTS = 200;
    private static final int MILLISECONDS_PER_POINT = 200;
    private static final int MAX_ATTEMPT_POINTS = 100;
    private static final int ATTEMPT_PENALTY = 25;

    public int calculate(ChallengeResult challenge) {
        if (!challenge.isSuccess()) return 0;

        int elapsedPenalty = (int) Math.min(MAX_SPEED_POINTS,
                challenge.getElapsedMilliseconds() / MILLISECONDS_PER_POINT);
        int speedPoints = MAX_SPEED_POINTS - elapsedPenalty;
        int attemptPoints = Math.max(0,
                MAX_ATTEMPT_POINTS - ((challenge.getAttempts() - 1) * ATTEMPT_PENALTY));
        return SUCCESS_POINTS + speedPoints + attemptPoints;
    }
}
