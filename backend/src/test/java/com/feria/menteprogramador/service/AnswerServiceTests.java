package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.AnswerRequest;
import com.feria.menteprogramador.dto.AnswerResponse;
import com.feria.menteprogramador.entity.Answer;
import com.feria.menteprogramador.entity.Participant;
import com.feria.menteprogramador.entity.Profile;
import com.feria.menteprogramador.exception.DuplicateAnswerException;
import com.feria.menteprogramador.repository.AnswerRepository;
import com.feria.menteprogramador.repository.ParticipantRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AnswerServiceTests {

    @Test
    void awardsPointsAndCalculatesPreliminaryProfile() {
        UUID participantId = UUID.randomUUID();
        ParticipantRepository participants = mock(ParticipantRepository.class);
        AnswerRepository answers = mock(AnswerRepository.class);
        Participant participant = new Participant("Luna");
        when(participants.findById(participantId)).thenReturn(Optional.of(participant));
        when(answers.existsByParticipant_IdAndQuestionNumber(participantId, 1)).thenReturn(false);
        when(answers.save(any(Answer.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(answers.findAllByParticipant_Id(participantId)).thenReturn(List.of());

        AnswerResponse response = new AnswerService(participants, answers)
                .save(participantId, new AnswerRequest(1, "C"));

        assertThat(response.awardedProfile()).isEqualTo(Profile.AI_EXPLORER);
        assertThat(response.points()).isEqualTo(3);
        assertThat(response.profileScores().get(Profile.AI_EXPLORER)).isEqualTo(3);
        assertThat(response.preliminaryProfile()).isEqualTo(Profile.AI_EXPLORER);
    }

    @Test
    void rejectsSecondAnswerForSameQuestion() {
        UUID participantId = UUID.randomUUID();
        ParticipantRepository participants = mock(ParticipantRepository.class);
        AnswerRepository answers = mock(AnswerRepository.class);
        when(participants.findById(participantId)).thenReturn(Optional.of(new Participant("Luna")));
        when(answers.existsByParticipant_IdAndQuestionNumber(participantId, 2)).thenReturn(true);

        AnswerService service = new AnswerService(participants, answers);

        assertThatThrownBy(() -> service.save(participantId, new AnswerRequest(2, "A")))
                .isInstanceOf(DuplicateAnswerException.class);
    }
}
