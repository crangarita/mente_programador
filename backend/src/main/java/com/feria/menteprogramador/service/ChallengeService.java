package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.ChallengeRequest;
import com.feria.menteprogramador.dto.ChallengeResponse;
import com.feria.menteprogramador.dto.ChallengeDefinitionResponse;
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
    private final ChallengeCatalog challengeCatalog;

    public ChallengeService(
            ParticipantRepository participantRepository,
            ChallengeResultRepository challengeResultRepository,
            ChallengeCatalog challengeCatalog
    ) {
        this.participantRepository = participantRepository;
        this.challengeResultRepository = challengeResultRepository;
        this.challengeCatalog = challengeCatalog;
    }

    @Transactional
    public ChallengeDefinitionResponse getOrAssign(UUID participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(ParticipantNotFoundException::new);
        if (participant.getChallengeId() == null) {
            participant.assignChallenge(challengeCatalog.random().id());
            participantRepository.save(participant);
        }
        return challengeCatalog.get(participant.getChallengeId());
    }

    @Transactional
    public ChallengeResponse save(UUID participantId, ChallengeRequest request) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(ParticipantNotFoundException::new);

        ChallengeDefinitionResponse challenge = getOrAssign(participantId);
        if (!challenge.id().equals(request.challengeId())) {
            throw new IllegalArgumentException("El reto enviado no corresponde al reto asignado");
        }
        boolean success = challengeCatalog.isSuccessful(challenge, request.commands());

        ChallengeResult result = challengeResultRepository.findByParticipant_Id(participantId)
                .map(existing -> {
                    existing.update(success, request.attempts(), request.elapsedMilliseconds());
                    return existing;
                })
                .orElseGet(() -> new ChallengeResult(
                        participant,
                        challenge.id(),
                        success,
                        request.attempts(),
                        request.elapsedMilliseconds()
                ));

        ChallengeResult saved = challengeResultRepository.save(result);
        return new ChallengeResponse(
                saved.getId(),
                saved.getChallengeId(),
                saved.isSuccess(),
                saved.getAttempts(),
                saved.getElapsedSeconds()
        );
    }
}
