package com.example.backend.Repository;

import com.example.backend.Entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SubjectRepo extends JpaRepository<Subject,Integer> {
    @Query(value = "SELECT s.* FROM subject s " +
            "JOIN subject_semester_count sc ON s.id = sc.subject_id " +
            "WHERE sc.semester = :semesterId", nativeQuery = true)
    List<Subject> findBySemesterCounts_Semester(Integer semesterId);


    @Query("SELECT s FROM Subject s LEFT JOIN FETCH s.semesterCounts")
    List<Subject> findAllWithSemesterCounts();

}
