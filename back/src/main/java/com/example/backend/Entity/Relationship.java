package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Builder
@Table(name = "relationship", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"subject_id", "semestr_id"})
})
public class Relationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

   @ManyToOne
    private Subject subject;


   @ManyToOne
    private Semestr semestr;

    private Integer subjectSemester;

    public Relationship(Subject subject, Semestr semestr, Integer subjectSemester) {
        this.subject = subject;
        this.semestr = semestr;
        this.subjectSemester = subjectSemester;
    }
}
