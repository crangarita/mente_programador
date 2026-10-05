package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.FinalResultResponse;
import com.feria.menteprogramador.entity.*;
import com.feria.menteprogramador.exception.IncompleteParticipationException;
import com.feria.menteprogramador.exception.ParticipantNotFoundException;
import com.feria.menteprogramador.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ResultService {
    private static final int REQUIRED_ANSWERS = 5;
    private static final List<Profile> LOGIC_TIE_ORDER = List.of(
            Profile.BACKEND_ARCHITECT, Profile.GAME_BUILDER, Profile.CYBER_GUARDIAN,
            Profile.DATA_DETECTIVE, Profile.AI_EXPLORER, Profile.FRONTEND_CREATOR
    );

    private final ParticipantRepository participantRepository;
    private final AnswerRepository answerRepository;
    private final ChallengeResultRepository challengeRepository;
    private final ResultRepository resultRepository;

    public ResultService(ParticipantRepository participantRepository, AnswerRepository answerRepository,
                         ChallengeResultRepository challengeRepository, ResultRepository resultRepository) {
        this.participantRepository = participantRepository;
        this.answerRepository = answerRepository;
        this.challengeRepository = challengeRepository;
        this.resultRepository = resultRepository;
    }

    @Transactional
    public FinalResultResponse finish(UUID participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(ParticipantNotFoundException::new);
        List<Answer> answers = answerRepository.findAllByParticipant_Id(participantId);
        if (answers.size() != REQUIRED_ANSWERS) {
            throw new IncompleteParticipationException("Debes responder las cinco preguntas antes de finalizar.");
        }
        ChallengeResult challenge = challengeRepository.findByParticipant_Id(participantId)
                .orElseThrow(() -> new IncompleteParticipationException("Debes realizar el reto antes de finalizar."));

        Profile profile = calculateProfile(answers, challenge.isSuccess());
        int testScore = 300;
        int challengeScore = calculateChallengeScore(challenge);
        challenge.setScore(challengeScore);
        challengeRepository.save(challenge);
        Result result = resultRepository.findByParticipant_Id(participantId)
                .map(current -> { current.update(profile, testScore, challengeScore); return current; })
                .orElseGet(() -> new Result(participant, profile, testScore, challengeScore));
        Result saved = resultRepository.save(result);
        long position = resultRepository.countByTotalScoreGreaterThan(saved.getTotalScore()) + 1;
        return new FinalResultResponse(participant.getAlias(), profile, testScore, challengeScore,
                saved.getTotalScore(), position);
    }

    Profile calculateProfile(List<Answer> answers, boolean challengeSuccess) {
        EnumMap<Profile, Integer> scores = new EnumMap<>(Profile.class);
        Arrays.stream(Profile.values()).forEach(profile -> scores.put(profile, 0));
        answers.forEach(answer -> scores.merge(answer.getProfile(), answer.getPoints(), Integer::sum));
        int maximum = scores.values().stream().max(Integer::compareTo).orElse(0);
        List<Profile> tied = scores.entrySet().stream().filter(entry -> entry.getValue() == maximum)
                .map(Map.Entry::getKey).toList();
        if (tied.size() == 1) return tied.getFirst();
        if (challengeSuccess) {
            return LOGIC_TIE_ORDER.stream().filter(tied::contains).findFirst().orElse(tied.getFirst());
        }
        return tied.getFirst();
    }

    int calculateChallengeScore(ChallengeResult challenge) {
        if (!challenge.isSuccess()) return 0;
        int speedScore = challenge.getElapsedSeconds() <= 10 ? 200
                : challenge.getElapsedSeconds() <= 20 ? 150
                : challenge.getElapsedSeconds() <= 30 ? 100 : 50;
        int firstAttemptBonus = challenge.getAttempts() == 1 ? 100 : 0;
        return 400 + speedScore + firstAttemptBonus;
    }
}
