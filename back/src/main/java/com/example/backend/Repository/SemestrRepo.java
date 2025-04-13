package com.example.backend.Repository;

import com.example.backend.Entity.Semestr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemestrRepo extends JpaRepository<Semestr, Integer> {

    @Query(value = "SELECT * FROM semestr WHERE direction_id = :directionId", nativeQuery = true)
    List<Semestr> findByDirectionId(Integer directionId);
}