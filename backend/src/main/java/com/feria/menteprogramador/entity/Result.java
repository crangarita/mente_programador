package com.feria.menteprogramador.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "result")
public class Result {
    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false, unique = true)
    private Participant participant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Profile profile;

    @Column(name = "test_score", nullable = false)
    private int testScore;

    @Column(name = "challenge_score", nullable = false)
    private int challengeScore;

    @Column(name = "total_score", nullable = false)
    private int totalScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Result() {}

    public Result(Participant participant, Profile profile, int testScore, int challengeScore) {
        this.participant = participant;
        update(profile, testScore, challengeScore);
    }

    public void update(Profile profile, int testScore, int challengeScore) {
        this.profile = profile;
        this.testScore = testScore;
        this.challengeScore = challengeScore;
        this.totalScore = Math.min(1000, testScore + challengeScore);
    }

    @PrePersist
    void prepareForInsert() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public Participant getParticipant() { return participant; }
    public Profile getProfile() { return profile; }
    public int getTestScore() { return testScore; }
    public int getChallengeScore() { return challengeScore; }
    public int getTotalScore() { return totalScore; }
}
