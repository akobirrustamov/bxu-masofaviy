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
@Table(name = "direction")
public class Direction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @CreationTimestamp
    private LocalDateTime createdAt;

    private Integer year;
    private Integer status;

    public Direction(Integer year, String name) {
        this.year = year;
        this.name = name;
    }

    public Direction(String name, LocalDateTime createdAt, Integer year, Integer status) {
        this.name = name;
        this.createdAt = createdAt;
        this.year = year;
        this.status = status;
    }
}
