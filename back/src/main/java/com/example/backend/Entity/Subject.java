package com.example.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Builder
@Table(name = "subject")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // 🔥 Bu parent class bo‘lgani uchun ishlatiladi
    private List<SubjectSemesterCount> semesterCounts;


    @ManyToOne
    private Attachment oquvDasturiPdf;

    @ManyToOne
    private Attachment oquvDasturiWord;

    @ManyToOne
    private Attachment sillabusPdf;

    @ManyToOne
    private Attachment sillabusWord;


    @ManyToOne
    private Attachment namunaviyDastur;
}