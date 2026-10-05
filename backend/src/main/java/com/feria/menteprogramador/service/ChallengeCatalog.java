package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.ChallengeDefinitionResponse;
import com.feria.menteprogramador.dto.ChallengeDefinitionResponse.Cell;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class ChallengeCatalog {
    private static final List<ChallengeDefinitionResponse> CHALLENGES = List.of(
            new ChallengeDefinitionResponse("ROUTE_A", "Ruta Boreal", 5, 5,
                    new Cell(4, 0), 1, new Cell(2, 2),
                    List.of(new Cell(3, 0), new Cell(3, 1), new Cell(4, 3))),
            new ChallengeDefinitionResponse("ROUTE_B", "Ruta Solar", 5, 5,
                    new Cell(0, 4), 2, new Cell(2, 2),
                    List.of(new Cell(0, 1), new Cell(1, 3), new Cell(3, 4))),
            new ChallengeDefinitionResponse("ROUTE_C", "Ruta Nebulosa", 5, 5,
                    new Cell(4, 4), 0, new Cell(2, 2),
                    List.of(new Cell(3, 3), new Cell(4, 1), new Cell(1, 4)))
    );

    public ChallengeDefinitionResponse random() {
        return CHALLENGES.get(ThreadLocalRandom.current().nextInt(CHALLENGES.size()));
    }

    public ChallengeDefinitionResponse get(String id) {
        return CHALLENGES.stream().filter(challenge -> challenge.id().equals(id)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("El reto indicado no existe"));
    }

    public boolean isSuccessful(ChallengeDefinitionResponse challenge, List<String> commands) {
        int row = challenge.start().row();
        int column = challenge.start().column();
        int direction = challenge.startDirection();

        for (String command : commands) {
            if ("TURN_LEFT".equals(command)) direction = (direction + 3) % 4;
            else if ("TURN_RIGHT".equals(command)) direction = (direction + 1) % 4;
            else if ("FORWARD".equals(command)) {
                int nextRow = row + new int[]{-1, 0, 1, 0}[direction];
                int nextColumn = column + new int[]{0, 1, 0, -1}[direction];
                Cell next = new Cell(nextRow, nextColumn);
                if (nextRow >= 0 && nextRow < challenge.rows() && nextColumn >= 0
                        && nextColumn < challenge.columns() && !challenge.obstacles().contains(next)) {
                    row = nextRow;
                    column = nextColumn;
                }
            } else {
                throw new IllegalArgumentException("La secuencia contiene un comando inválido");
            }
        }
        return row == challenge.target().row() && column == challenge.target().column();
    }
}
