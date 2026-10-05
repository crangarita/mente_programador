package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.RankingEntryResponse;
import com.feria.menteprogramador.entity.Result;
import com.feria.menteprogramador.repository.ResultRepository;
import org.springframework.data.domain.PageRequest;
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
        List<Result> results = resultRepository.findRanked(PageRequest.of(0, safeLimit));

        List<RankingEntryResponse> ranking = new ArrayList<>(results.size());
        for (int index = 0; index < results.size(); index++) {
            Result result = results.get(index);
            ranking.add(new RankingEntryResponse(
                    index + 1L,
                    result.getParticipant().getAlias(),
                    result.getProfile(),
                    result.getTotalScore()
            ));
        }
        return ranking;
    }
}
