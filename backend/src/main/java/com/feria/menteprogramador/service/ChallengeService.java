package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.ChallengeRequest;
import com.feria.menteprogramador.dto.ChallengeResponse;
import com.feria.menteprogramador.entity.ChallengeResult;
import com.feria.menteprogramador.entity.Participant;
import com.feria.menteprogramador.exception.ParticipantNotFoundException;
import com.feria.menteprogramador.repository.ChallengeResultRepository;
import com.feria.menteprogramador.repository.ParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ChallengeService {

    private final ParticipantRepository participantRepository;
    private final ChallengeResultRepository challengeResultRepository;

    public ChallengeService(
            ParticipantRepository participantRepository,
            ChallengeResultRepository challengeResultRepository
    ) {
        this.participantRepository = participantRepository;
        this.challengeResultRepository = challengeResultRepository;
    }

    @Transactional
    public ChallengeResponse save(UUID participantId, ChallengeRequest request) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(ParticipantNotFoundException::new);

        ChallengeResult result = challengeResultRepository.findByParticipant_Id(participantId)
                .map(existing -> {
                    existing.update(request.success(), request.attempts(), request.elapsedMilliseconds());
                    return existing;
                })
                .orElseGet(() -> new ChallengeResult(
                        participant,
                        request.success(),
                        request.attempts(),
                        request.elapsedMilliseconds()
                ));

        ChallengeResult saved = challengeResultRepository.save(result);
        return new ChallengeResponse(
                saved.getId(),
                saved.isSuccess(),
                saved.getAttempts(),
                saved.getElapsedSeconds()
        );
    }
}
