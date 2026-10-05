package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.AnswerRequest;
import com.feria.menteprogramador.dto.AnswerResponse;
import com.feria.menteprogramador.entity.Answer;
import com.feria.menteprogramador.entity.Participant;
import com.feria.menteprogramador.entity.Profile;
import com.feria.menteprogramador.exception.DuplicateAnswerException;
import com.feria.menteprogramador.exception.ParticipantNotFoundException;
import com.feria.menteprogramador.repository.AnswerRepository;
import com.feria.menteprogramador.repository.ParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AnswerService {

    private static final int POINTS_PER_ANSWER = 3;
    private static final Map<String, Profile> OPTION_PROFILES = Map.of(
            "A", Profile.FRONTEND_CREATOR,
            "B", Profile.BACKEND_ARCHITECT,
            "C", Profile.AI_EXPLORER,
            "D", Profile.CYBER_GUARDIAN,
            "E", Profile.DATA_DETECTIVE,
            "F", Profile.GAME_BUILDER
    );

    private final ParticipantRepository participantRepository;
    private final AnswerRepository answerRepository;

    public AnswerService(ParticipantRepository participantRepository, AnswerRepository answerRepository) {
        this.participantRepository = participantRepository;
        this.answerRepository = answerRepository;
    }

    @Transactional
    public AnswerResponse save(UUID participantId, AnswerRequest request) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(ParticipantNotFoundException::new);

        if (answerRepository.existsByParticipant_IdAndQuestionNumber(participantId, request.questionNumber())) {
            throw new DuplicateAnswerException(request.questionNumber());
        }

        Map<Profile, Integer> scores = emptyScores();
        answerRepository.findAllByParticipant_Id(participantId)
                .forEach(answer -> scores.merge(answer.getProfile(), answer.getPoints(), Integer::sum));

        Profile awardedProfile = OPTION_PROFILES.get(request.selectedOption());
        Answer saved = answerRepository.save(new Answer(
                participant,
                request.questionNumber(),
                request.selectedOption(),
                awardedProfile,
                POINTS_PER_ANSWER
        ));

        scores.merge(awardedProfile, POINTS_PER_ANSWER, Integer::sum);

        Profile preliminaryProfile = Arrays.stream(Profile.values())
                .max((left, right) -> Integer.compare(scores.get(left), scores.get(right)))
                .orElse(Profile.FRONTEND_CREATOR);

        return new AnswerResponse(
                saved.getId(),
                saved.getQuestionNumber(),
                saved.getSelectedOption(),
                saved.getProfile(),
                saved.getPoints(),
                scores,
                preliminaryProfile
        );
    }

    private EnumMap<Profile, Integer> emptyScores() {
        EnumMap<Profile, Integer> scores = new EnumMap<>(Profile.class);
        Arrays.stream(Profile.values()).forEach(profile -> scores.put(profile, 0));
        return scores;
    }
}
