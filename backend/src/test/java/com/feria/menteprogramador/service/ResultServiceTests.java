package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.FinalResultResponse;
import com.feria.menteprogramador.entity.*;
import com.feria.menteprogramador.exception.IncompleteParticipationException;
import com.feria.menteprogramador.repository.*;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ResultServiceTests {
    @Test
    void calculatesMaximumScoreAndRankingPosition() {
        Fixture fixture = new Fixture();
        fixture.answers(Profile.AI_EXPLORER, Profile.AI_EXPLORER, Profile.AI_EXPLORER,
                Profile.FRONTEND_CREATOR, Profile.BACKEND_ARCHITECT);
        ChallengeResult challenge = new ChallengeResult(fixture.participant, true, 1, 0);
        when(fixture.challenges.findByParticipant_Id(fixture.participantId)).thenReturn(Optional.of(challenge));
        when(fixture.results.countByTotalScoreGreaterThan(1000)).thenReturn(2L);

        FinalResultResponse response = fixture.service().finish(fixture.participantId);

        assertThat(response.profile()).isEqualTo(Profile.AI_EXPLORER);
        assertThat(response.testScore()).isEqualTo(300);
        assertThat(response.challengeScore()).isEqualTo(700);
        assertThat(response.score()).isEqualTo(1000);
        assertThat(response.rankingPosition()).isEqualTo(3);
        assertThat(challenge.getScore()).isEqualTo(700);
    }

    @Test
    void appliesSpeedBandsAndNoFirstAttemptBonus() {
        Fixture fixture = new Fixture();
        fixture.answers(Profile.FRONTEND_CREATOR, Profile.FRONTEND_CREATOR, Profile.FRONTEND_CREATOR,
                Profile.DATA_DETECTIVE, Profile.GAME_BUILDER);
        when(fixture.challenges.findByParticipant_Id(fixture.participantId))
                .thenReturn(Optional.of(new ChallengeResult(fixture.participant, true, 2, 24_000)));

        FinalResultResponse response = fixture.service().finish(fixture.participantId);

        assertThat(response.challengeScore()).isEqualTo(555);
        assertThat(response.score()).isEqualTo(855);
    }

    @Test
    void successfulChallengeBreaksProfileTieTowardLogicalProfile() {
        Fixture fixture = new Fixture();
        fixture.answers(Profile.FRONTEND_CREATOR, Profile.BACKEND_ARCHITECT, Profile.FRONTEND_CREATOR,
                Profile.BACKEND_ARCHITECT, Profile.AI_EXPLORER);
        when(fixture.challenges.findByParticipant_Id(fixture.participantId))
                .thenReturn(Optional.of(new ChallengeResult(fixture.participant, true, 2, 40_000)));

        assertThat(fixture.service().finish(fixture.participantId).profile()).isEqualTo(Profile.BACKEND_ARCHITECT);
    }

    @Test
    void rejectsIncompleteQuiz() {
        Fixture fixture = new Fixture();
        fixture.answers(Profile.AI_EXPLORER);
        assertThatThrownBy(() -> fixture.service().finish(fixture.participantId))
                .isInstanceOf(IncompleteParticipationException.class);
    }

    private static class Fixture {
        final UUID participantId = UUID.randomUUID();
        final Participant participant = new Participant("Nova");
        final ParticipantRepository participants = mock(ParticipantRepository.class);
        final AnswerRepository answerRepository = mock(AnswerRepository.class);
        final ChallengeResultRepository challenges = mock(ChallengeResultRepository.class);
        final ResultRepository results = mock(ResultRepository.class);

        Fixture() {
            when(participants.findById(participantId)).thenReturn(Optional.of(participant));
            when(results.findByParticipant_Id(participantId)).thenReturn(Optional.empty());
            when(results.save(any(Result.class))).thenAnswer(invocation -> invocation.getArgument(0));
        }

        void answers(Profile... profiles) {
            List<Answer> answers = new ArrayList<>();
            for (int index = 0; index < profiles.length; index++) {
                answers.add(new Answer(participant, index + 1, "A", profiles[index], 3));
            }
            when(answerRepository.findAllByParticipant_Id(participantId)).thenReturn(answers);
        }

        ResultService service() {
            return new ResultService(participants, answerRepository, challenges, results,
                    new ChallengeScoreCalculator());
        }
    }
}
