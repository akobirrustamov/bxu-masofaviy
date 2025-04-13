package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Builder
@Table(name = "semestr")
public class Semestr {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @CreationTimestamp
    private LocalDateTime createdAt;
    private  String educationYear;
    @ManyToOne
    private Direction direction;

    public Semestr(String name, LocalDateTime createdAt, String educationYear, Direction direction) {
        this.name = name;
        this.createdAt = createdAt;
        this.educationYear = educationYear;
        this.direction = direction;
    }
}
