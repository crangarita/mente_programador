package com.feria.menteprogramador.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "participant")
public class Participant {

    @Id
    private UUID id;

    @Column(nullable = false, length = 30)
    private String alias;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "challenge_id", length = 30)
    private String challengeId;

    protected Participant() {
    }

    public Participant(String alias) {
        this.alias = alias;
    }

    @PrePersist
    void prepareForInsert() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getAlias() {
        return alias;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getChallengeId() { return challengeId; }

    public void assignChallenge(String challengeId) {
        if (this.challengeId == null) this.challengeId = challengeId;
    }
}
