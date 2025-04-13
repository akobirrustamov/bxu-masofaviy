package com.example.backend.Repository;

import com.example.backend.Entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LessonRepo extends JpaRepository<Lesson, Integer> {

    @Query(value = "SELECT * FROM lesson WHERE subject_id = :subjectId ORDER BY lesson_type DESC, lesson_order ASC", nativeQuery = true)
    List<Lesson> findAllBySubjectId(Integer subjectId);

    @Query(value = "SELECT * FROM lesson WHERE subject_id = :subjectId ORDER BY lesson_type DESC, lesson_order ASC", nativeQuery = true)
    List<Lesson> findBySubjectId(Integer subjectId);

}
