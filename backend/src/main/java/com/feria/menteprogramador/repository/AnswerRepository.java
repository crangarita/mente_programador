package com.feria.menteprogramador.repository;

import com.feria.menteprogramador.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AnswerRepository extends JpaRepository<Answer, UUID> {
    boolean existsByParticipant_IdAndQuestionNumber(UUID participantId, int questionNumber);

    List<Answer> findAllByParticipant_Id(UUID participantId);
}

