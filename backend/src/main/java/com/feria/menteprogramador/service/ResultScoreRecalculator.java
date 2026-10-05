package com.feria.menteprogramador.service;

import com.feria.menteprogramador.entity.Result;
import com.feria.menteprogramador.repository.ChallengeResultRepository;
import com.feria.menteprogramador.repository.ResultRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ResultScoreRecalculator implements ApplicationRunner {
    private final ResultRepository resultRepository;
    private final ChallengeResultRepository challengeRepository;
    private final ChallengeScoreCalculator scoreCalculator;

    public ResultScoreRecalculator(ResultRepository resultRepository,
                                   ChallengeResultRepository challengeRepository,
                                   ChallengeScoreCalculator scoreCalculator) {
        this.resultRepository = resultRepository;
        this.challengeRepository = challengeRepository;
        this.scoreCalculator = scoreCalculator;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        for (Result result : resultRepository.findAll()) {
            challengeRepository.findByParticipant_Id(result.getParticipant().getId()).ifPresent(challenge -> {
                int challengeScore = scoreCalculator.calculate(challenge);
                challenge.setScore(challengeScore);
                result.update(result.getProfile(), result.getTestScore(), challengeScore);
                challengeRepository.save(challenge);
                resultRepository.save(result);
            });
        }
    }
}
