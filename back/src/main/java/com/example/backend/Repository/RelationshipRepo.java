package com.example.backend.Repository;

import com.example.backend.Entity.Relationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RelationshipRepo extends JpaRepository<Relationship, Integer> {
    @Query(value = "SELECT * FROM relationship  WHERE semestr_id = :semestrId", nativeQuery = true)
    List<Relationship> findBySemestrId(Integer semestrId);
}
