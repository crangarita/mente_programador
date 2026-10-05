package com.feria.menteprogramador;

import com.feria.menteprogramador.repository.ParticipantRepository;
import com.feria.menteprogramador.repository.AnswerRepository;
import com.feria.menteprogramador.repository.ChallengeResultRepository;
import com.feria.menteprogramador.repository.ResultRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(
        properties = {
                "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration"
        }
)
class MenteProgramadorApplicationTests {

    @MockitoBean
    private ParticipantRepository participantRepository;

    @MockitoBean
    private AnswerRepository answerRepository;

    @MockitoBean
    private ChallengeResultRepository challengeResultRepository;

    @MockitoBean
    private ResultRepository resultRepository;

    @Test
    void contextLoads() {
    }
}
