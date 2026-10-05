package com.feria.menteprogramador.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "answer",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_answer_participant_question",
                columnNames = {"participant_id", "question_number"}
        )
)
public class Answer {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;

    @Column(name = "question_number", nullable = false)
    private int questionNumber;

    @Column(name = "selected_option", nullable = false, length = 1)
    private String selectedOption;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Profile profile;

    @Column(nullable = false)
    private int points;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Answer() {
    }

    public Answer(Participant participant, int questionNumber, String selectedOption, Profile profile, int points) {
        this.participant = participant;
        this.questionNumber = questionNumber;
        this.selectedOption = selectedOption;
        this.profile = profile;
        this.points = points;
    }

    @PrePersist
    void prepareForInsert() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public int getQuestionNumber() { return questionNumber; }
    public String getSelectedOption() { return selectedOption; }
    public Profile getProfile() { return profile; }
    public int getPoints() { return points; }
}

