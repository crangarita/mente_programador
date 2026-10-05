package com.feria.menteprogramador.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ChallengeCatalogTests {
    private final ChallengeCatalog catalog = new ChallengeCatalog();

    @Test
    void allThreeEquivalentRoutesCanBeSolvedInFiveInstructions() {
        List<String> routeA = List.of("FORWARD", "FORWARD", "TURN_LEFT", "FORWARD", "FORWARD");
        List<String> routeB = List.of("FORWARD", "FORWARD", "TURN_RIGHT", "FORWARD", "FORWARD");

        assertThat(catalog.isSuccessful(catalog.get("ROUTE_A"), routeA)).isTrue();
        assertThat(catalog.isSuccessful(catalog.get("ROUTE_B"), routeB)).isTrue();
        assertThat(catalog.isSuccessful(catalog.get("ROUTE_C"), routeA)).isTrue();
    }

    @Test
    void rejectsASequenceThatDoesNotReachTheTarget() {
        assertThat(catalog.isSuccessful(catalog.get("ROUTE_A"), List.of("FORWARD"))).isFalse();
    }
}
