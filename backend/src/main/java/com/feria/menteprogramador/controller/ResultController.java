package com.feria.menteprogramador.controller;

import com.feria.menteprogramador.dto.FinalResultResponse;
import com.feria.menteprogramador.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/participants/{participantId}/finish")
public class ResultController {
    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping
    public ResponseEntity<FinalResultResponse> finish(@PathVariable UUID participantId) {
        return ResponseEntity.ok(resultService.finish(participantId));
    }
}
