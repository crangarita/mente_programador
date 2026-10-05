package com.feria.menteprogramador.controller;

import com.feria.menteprogramador.dto.ParticipantResponse;
import com.feria.menteprogramador.exception.GlobalExceptionHandler;
import com.feria.menteprogramador.service.ParticipantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ParticipantControllerTests {

    private ParticipantService service;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        service = mock(ParticipantService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new ParticipantController(service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createsParticipant() throws Exception {
        UUID id = UUID.randomUUID();
        when(service.create(any())).thenReturn(new ParticipantResponse(id, "Luna", Instant.now()));

        mockMvc.perform(post("/api/participants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Luna\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.alias").value("Luna"));
    }

    @Test
    void rejectsShortAlias() throws Exception {
        mockMvc.perform(post("/api/participants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"A\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.alias").exists());
    }

    @Test
    void rejectsMalformedJsonWithConsistentErrorBody() throws Exception {
        mockMvc.perform(post("/api/participants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{bad"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("La solicitud no tiene un formato válido"));
    }

    @Test
    void rejectsControlCharactersInAlias() throws Exception {
        mockMvc.perform(post("/api/participants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Luna\\nByte\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.alias").exists());
    }
}
