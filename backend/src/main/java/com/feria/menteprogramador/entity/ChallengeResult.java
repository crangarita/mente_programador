package com.feria.menteprogramador.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "challenge_result")
public class ChallengeResult {

    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false, unique = true)
    private Participant participant;

    @Column(nullable = false)
    private boolean success;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "elapsed_seconds", nullable = false)
    private int elapsedSeconds;

    @Column(nullable = false)
    private int score;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected ChallengeResult() {
    }

    public ChallengeResult(Participant participant, boolean success, int attempts, int elapsedSeconds) {
        this.participant = participant;
        update(success, attempts, elapsedSeconds);
    }

    public void update(boolean success, int attempts, int elapsedSeconds) {
        this.success = success;
        this.attempts = attempts;
        this.elapsedSeconds = elapsedSeconds;
        this.score = 0;
    }

    @PrePersist
    void prepareForInsert() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public boolean isSuccess() { return success; }
    public int getAttempts() { return attempts; }
    public int getElapsedSeconds() { return elapsedSeconds; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}
