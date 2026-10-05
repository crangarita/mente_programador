package com.feria.menteprogramador.repository;

import com.feria.menteprogramador.entity.ChallengeResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChallengeResultRepository extends JpaRepository<ChallengeResult, UUID> {
    Optional<ChallengeResult> findByParticipant_Id(UUID participantId);
}

