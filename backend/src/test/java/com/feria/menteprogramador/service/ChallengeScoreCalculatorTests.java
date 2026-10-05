package com.feria.menteprogramador.service;

import com.feria.menteprogramador.entity.ChallengeResult;
import com.feria.menteprogramador.entity.Participant;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ChallengeScoreCalculatorTests {
    private final ChallengeScoreCalculator calculator = new ChallengeScoreCalculator();
    private final Participant participant = new Participant("Nova");

    @Test
    void subtractsFiveSpeedPointsPerSecondUsingMilliseconds() {
        assertThat(calculator.calculate(new ChallengeResult(participant, true, 1, 0))).isEqualTo(700);
        assertThat(calculator.calculate(new ChallengeResult(participant, true, 1, 1_000))).isEqualTo(695);
        assertThat(calculator.calculate(new ChallengeResult(participant, true, 1, 1_200))).isEqualTo(694);
    }

    @Test
    void penalizesAdditionalAttemptsAndFloorsSpeedAtZero() {
        assertThat(calculator.calculate(new ChallengeResult(participant, true, 2, 10_000))).isEqualTo(625);
        assertThat(calculator.calculate(new ChallengeResult(participant, true, 5, 60_000))).isEqualTo(400);
    }

    @Test
    void unsuccessfulChallengeScoresZero() {
        assertThat(calculator.calculate(new ChallengeResult(participant, false, 1, 0))).isZero();
    }
}
