package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.RankingEntryResponse;
import com.feria.menteprogramador.entity.Result;
import com.feria.menteprogramador.repository.ResultRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class RankingService {
    private final ResultRepository resultRepository;

    public RankingService(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    @Transactional(readOnly = true)
    public List<RankingEntryResponse> getRanking(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 100));
        List<Result> results = resultRepository.findAll(PageRequest.of(
                0,
                safeLimit,
                Sort.by(Sort.Order.desc("totalScore"), Sort.Order.asc("createdAt"))
        )).getContent();

        List<RankingEntryResponse> ranking = new ArrayList<>(results.size());
        long currentPosition = 0;
        Integer previousScore = null;
        for (int index = 0; index < results.size(); index++) {
            Result result = results.get(index);
            if (previousScore == null || result.getTotalScore() < previousScore) {
                currentPosition = index + 1L;
            }
            ranking.add(new RankingEntryResponse(
                    currentPosition,
                    result.getParticipant().getAlias(),
                    result.getProfile(),
                    result.getTotalScore()
            ));
            previousScore = result.getTotalScore();
        }
        return ranking;
    }
}
