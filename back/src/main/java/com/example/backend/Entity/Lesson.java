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
@Table(name = "lesson")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer lessonOrder;
    private String name;
    private Integer lessonType;
    //    1- maruza
    //    2- seminar
    //    3- amaliy
    //    4- labaratoriya

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    private Subject subject;
    private Integer subjectSemester;

    @ManyToOne
    private Attachment matni;

    @ManyToOne
    private Attachment taqdimot;

    @ManyToOne
    private Attachment test;

    @ManyToOne
    private Attachment glossary;

    @ManyToOne
    private Attachment amaliy;  // Any format

    @ManyToOne
    private Attachment qoshimcha;  // Any format
    @Column(length = 1000)
    private String youtubeIframeLink;  // YouTube iframe link

}