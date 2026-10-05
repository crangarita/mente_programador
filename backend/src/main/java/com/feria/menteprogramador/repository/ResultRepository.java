package com.feria.menteprogramador.repository;

import com.feria.menteprogramador.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import com.feria.menteprogramador.entity.Profile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResultRepository extends JpaRepository<Result, UUID> {
    Optional<Result> findByParticipant_Id(UUID participantId);
    long countByTotalScoreGreaterThan(int totalScore);

    @Query("select avg(r.totalScore) from Result r")
    Double findAverageScore();

    @Query("select r.profile from Result r group by r.profile order by count(r) desc, r.profile asc")
    List<Profile> findProfilesByFrequency(Pageable pageable);
}
