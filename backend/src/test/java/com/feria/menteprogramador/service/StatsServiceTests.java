package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.StatsResponse;
import com.feria.menteprogramador.entity.Profile;
import com.feria.menteprogramador.repository.ParticipantRepository;
import com.feria.menteprogramador.repository.ResultRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class StatsServiceTests {
    @Test
    void calculatesEventStatistics() {
        ParticipantRepository participants = mock(ParticipantRepository.class);
        ResultRepository results = mock(ResultRepository.class);
        when(participants.count()).thenReturn(187L);
        when(results.findAverageScore()).thenReturn(723.6);
        when(results.findProfilesByFrequency(any(Pageable.class))).thenReturn(List.of(Profile.AI_EXPLORER));
        when(results.findProfileCounts()).thenReturn(List.<Object[]>of(new Object[]{Profile.AI_EXPLORER, 52L}));

        StatsResponse stats = new StatsService(participants, results).getStats();

        assertThat(stats.participants()).isEqualTo(187);
        assertThat(stats.averageScore()).isEqualTo(724);
        assertThat(stats.mostCommonProfile()).isEqualTo(Profile.AI_EXPLORER);
        assertThat(stats.profileDistribution().get(Profile.AI_EXPLORER)).isEqualTo(52L);
        assertThat(stats.profileDistribution().get(Profile.GAME_BUILDER)).isZero();
    }

    @Test
    void returnsEmptyStateWhenThereAreNoResults() {
        ParticipantRepository participants = mock(ParticipantRepository.class);
        ResultRepository results = mock(ResultRepository.class);
        when(results.findProfilesByFrequency(any(Pageable.class))).thenReturn(List.of());
        when(results.findProfileCounts()).thenReturn(List.of());

        StatsResponse stats = new StatsService(participants, results).getStats();

        assertThat(stats.averageScore()).isZero();
        assertThat(stats.mostCommonProfile()).isNull();
    }
}
