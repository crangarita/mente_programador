package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.StatsResponse;
import com.feria.menteprogramador.entity.Profile;
import com.feria.menteprogramador.repository.ParticipantRepository;
import com.feria.menteprogramador.repository.ResultRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StatsService {
    private final ParticipantRepository participantRepository;
    private final ResultRepository resultRepository;

    public StatsService(ParticipantRepository participantRepository, ResultRepository resultRepository) {
        this.participantRepository = participantRepository;
        this.resultRepository = resultRepository;
    }

    @Transactional(readOnly = true)
    public StatsResponse getStats() {
        long participants = participantRepository.count();
        Double average = resultRepository.findAverageScore();
        List<Profile> profiles = resultRepository.findProfilesByFrequency(PageRequest.of(0, 1));
        return new StatsResponse(
                participants,
                average == null ? 0 : (int) Math.round(average),
                profiles.isEmpty() ? null : profiles.getFirst()
        );
    }
}
