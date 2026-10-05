package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.RankingEntryResponse;
import com.feria.menteprogramador.entity.Participant;
import com.feria.menteprogramador.entity.Profile;
import com.feria.menteprogramador.entity.Result;
import com.feria.menteprogramador.repository.ResultRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RankingServiceTests {
    @Test
    void returnsOrderedEntriesWithPositions() {
        ResultRepository repository = mock(ResultRepository.class);
        Result first = new Result(new Participant("Nova"), Profile.AI_EXPLORER, 300, 700);
        Result second = new Result(new Participant("Pixel"), Profile.FRONTEND_CREATOR, 300, 550);
        when(repository.findRanked(any(Pageable.class))).thenReturn(List.of(first, second));

        List<RankingEntryResponse> ranking = new RankingService(repository).getRanking(10);

        assertThat(ranking).extracting(RankingEntryResponse::position).containsExactly(1L, 2L);
        assertThat(ranking).extracting(RankingEntryResponse::alias).containsExactly("Nova", "Pixel");
        assertThat(ranking).extracting(RankingEntryResponse::score).containsExactly(1000, 850);
    }

    @Test
    void limitsRequestsToOneHundredEntries() {
        ResultRepository repository = mock(ResultRepository.class);
        when(repository.findRanked(any(Pageable.class))).thenAnswer(invocation -> {
            Pageable pageable = invocation.getArgument(0);
            assertThat(pageable.getPageSize()).isEqualTo(100);
            return List.of();
        });

        assertThat(new RankingService(repository).getRanking(500)).isEmpty();
    }

    @Test
    void participantsWithEqualScoresReceiveDeterministicSequentialPositions() {
        ResultRepository repository = mock(ResultRepository.class);
        Result first = new Result(new Participant("Nova"), Profile.AI_EXPLORER, 300, 700);
        Result tied = new Result(new Participant("Byte"), Profile.BACKEND_ARCHITECT, 300, 700);
        Result third = new Result(new Participant("Pixel"), Profile.FRONTEND_CREATOR, 300, 600);
        when(repository.findRanked(any(Pageable.class))).thenReturn(List.of(first, tied, third));

        assertThat(new RankingService(repository).getRanking(10))
                .extracting(RankingEntryResponse::position)
                .containsExactly(1L, 2L, 3L);
    }
}
