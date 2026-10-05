package com.feria.menteprogramador.dto;

import java.util.List;

public record ChallengeDefinitionResponse(
        String id,
        String name,
        int rows,
        int columns,
        Cell start,
        int startDirection,
        Cell target,
        List<Cell> obstacles
) {
    public record Cell(int row, int column) {}
}
