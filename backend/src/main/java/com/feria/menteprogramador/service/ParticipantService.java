package com.feria.menteprogramador.service;

import com.feria.menteprogramador.dto.ParticipantRequest;
import com.feria.menteprogramador.dto.ParticipantResponse;
import com.feria.menteprogramador.entity.Participant;
import com.feria.menteprogramador.repository.ParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    @Transactional
    public ParticipantResponse create(ParticipantRequest request) {
        Participant participant = participantRepository.save(new Participant(request.alias()));

        return new ParticipantResponse(
                participant.getId(),
                participant.getAlias(),
                participant.getCreatedAt()
        );
    }
}
