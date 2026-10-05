package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.ParticipantRequest;
import com.feria.menteprogramador.dto.ParticipantResponse;
import com.feria.menteprogramador.entity.Participant;
import com.feria.menteprogramador.repository.ParticipantRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParticipantServiceTests {

    @Mock
    private ParticipantRepository repository;

    @Test
    void trimsAliasBeforeSaving() {
        when(repository.save(org.mockito.ArgumentMatchers.any(Participant.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ParticipantService service = new ParticipantService(repository);

        ParticipantResponse response = service.create(new ParticipantRequest("  Luna  "));

        ArgumentCaptor<Participant> captor = ArgumentCaptor.forClass(Participant.class);
        org.mockito.Mockito.verify(repository).save(captor.capture());
        assertThat(captor.getValue().getAlias()).isEqualTo("Luna");
        assertThat(response.alias()).isEqualTo("Luna");
    }
}
