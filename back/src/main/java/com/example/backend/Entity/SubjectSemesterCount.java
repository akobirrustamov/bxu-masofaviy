package com.example.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "subject_semester_count")
public class SubjectSemesterCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer semester;

    private Integer maruzaCount;
    private Integer seminarCount;
    private Integer amaliyCount;
    private Integer labaratoriyaCount;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    @JsonIgnore  // 🔥 Subject ichidagi subjectSemesterCounts JSON dan chiqib ketadi
    private Subject subject;
}