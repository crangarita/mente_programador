package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.ChallengeRequest;
import com.feria.menteprogramador.dto.ChallengeResponse;
import com.feria.menteprogramador.entity.ChallengeResult;
import com.feria.menteprogramador.entity.Participant;
import com.feria.menteprogramador.repository.ChallengeResultRepository;
import com.feria.menteprogramador.repository.ParticipantRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ChallengeServiceTests {

    @Test
    void persistsChallengeResult() {
        UUID participantId = UUID.randomUUID();
        ParticipantRepository participants = mock(ParticipantRepository.class);
        ChallengeResultRepository challenges = mock(ChallengeResultRepository.class);
        Participant participant = new Participant("Luna");
        participant.assignChallenge("ROUTE_A");
        when(participants.findById(participantId)).thenReturn(Optional.of(participant));
        when(participants.save(participant)).thenReturn(participant);
        when(challenges.findByParticipant_Id(participantId)).thenReturn(Optional.empty());
        when(challenges.save(any(ChallengeResult.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ChallengeResponse response = new ChallengeService(participants, challenges, new ChallengeCatalog())
                .save(participantId, new ChallengeRequest("ROUTE_A",
                        List.of("FORWARD", "FORWARD", "TURN_LEFT", "FORWARD", "FORWARD"), 2, 17_000));

        assertThat(response.success()).isTrue();
        assertThat(response.attempts()).isEqualTo(2);
        assertThat(response.elapsedSeconds()).isEqualTo(17);
    }

    @Test
    void updatesExistingResultAfterAnotherAttempt() {
        UUID participantId = UUID.randomUUID();
        ParticipantRepository participants = mock(ParticipantRepository.class);
        ChallengeResultRepository challenges = mock(ChallengeResultRepository.class);
        Participant participant = new Participant("Luna");
        participant.assignChallenge("ROUTE_A");
        ChallengeResult existing = new ChallengeResult(participant, false, 1, 8);
        when(participants.findById(participantId)).thenReturn(Optional.of(participant));
        when(challenges.findByParticipant_Id(participantId)).thenReturn(Optional.of(existing));
        when(challenges.save(existing)).thenReturn(existing);

        ChallengeResponse response = new ChallengeService(participants, challenges, new ChallengeCatalog())
                .save(participantId, new ChallengeRequest("ROUTE_A",
                        List.of("FORWARD", "FORWARD", "TURN_LEFT", "FORWARD", "FORWARD"), 2, 14_000));

        assertThat(response.success()).isTrue();
        assertThat(response.attempts()).isEqualTo(2);
    }

    @Test
    void keepsTheSameAssignedChallenge() {
        UUID participantId = UUID.randomUUID();
        ParticipantRepository participants = mock(ParticipantRepository.class);
        ChallengeResultRepository challenges = mock(ChallengeResultRepository.class);
        Participant participant = new Participant("Luna");
        participant.assignChallenge("ROUTE_C");
        when(participants.findById(participantId)).thenReturn(Optional.of(participant));

        ChallengeService service = new ChallengeService(participants, challenges, new ChallengeCatalog());

        assertThat(service.getOrAssign(participantId).id()).isEqualTo("ROUTE_C");
        assertThat(service.getOrAssign(participantId).id()).isEqualTo("ROUTE_C");
    }
}
