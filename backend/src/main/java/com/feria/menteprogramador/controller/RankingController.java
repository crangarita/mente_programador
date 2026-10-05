package com.feria.menteprogramador.controller;

import com.feria.menteprogramador.dto.RankingEntryResponse;
import com.feria.menteprogramador.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
public class RankingController {
    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping
    public ResponseEntity<List<RankingEntryResponse>> getRanking(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(rankingService.getRanking(limit));
    }
}
