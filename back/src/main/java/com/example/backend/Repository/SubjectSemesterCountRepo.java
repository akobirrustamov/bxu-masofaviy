package com.example.backend.Repository;

import com.example.backend.Entity.SubjectSemesterCount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectSemesterCountRepo extends JpaRepository<SubjectSemesterCount,Integer> {
}
