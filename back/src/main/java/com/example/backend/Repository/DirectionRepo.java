package com.example.backend.Repository;

import com.example.backend.Entity.Direction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectionRepo  extends JpaRepository<Direction,Integer> {
}
