package com.feria.menteprogramador.dto;

import java.time.Instant;
import java.util.UUID;

public record ParticipantResponse(UUID id, String alias, Instant createdAt) {
}

