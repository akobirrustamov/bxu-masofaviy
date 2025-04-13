package com.example.backend.Controller;

import com.example.backend.Entity.Direction;
import com.example.backend.Entity.Semestr;
import com.example.backend.Repository.DirectionRepo;
import com.example.backend.Repository.SemestrRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/direction")
public class DirectionController {
    private final DirectionRepo directionRepo;
    private final SemestrRepo semestrRepo;

    // Get all directions
    @GetMapping
    public HttpEntity<?> getAllDirections() {
        List<Direction> directions = directionRepo.findAll();
        return ResponseEntity.ok(directions);
    }

    // Get a single direction by ID
    @GetMapping("/{id}")
    public HttpEntity<?> getDirectionById(@PathVariable Integer id) {
        Optional<Direction> direction = directionRepo.findById(id);
        if (direction.isPresent()) {
            return ResponseEntity.ok(direction.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all semesters by direction ID
    @GetMapping("/{id}/semesters")
    public HttpEntity<?> getSemestersByDirectionId(@PathVariable Integer id) {
        List<Semestr> semesters = semestrRepo.findByDirectionId(id);
        return ResponseEntity.ok(semesters);
    }

    // Create a new direction
    @PostMapping
    public HttpEntity<?> addDirection(@RequestBody Direction direction) {
        // Save the new direction
        Direction savedDirection = directionRepo.save(new Direction(direction.getName(), LocalDateTime.now(), direction.getYear(), 1));

        // Create semesters with dynamic academic years
        List<Semestr> semesters = new ArrayList<>();
        int year = savedDirection.getYear();

        for (int i = 1; i <= 8; i++) {
            // Calculate the academic year based on the semester number
            int academicYearOffset = (i - 1) / 2; // Each pair of semesters shares the same academic year
            String academicYear = (year + academicYearOffset) + "-" + (year + academicYearOffset + 1);

            // Create the semester
            String semesterName = i + "-semestr";
            Semestr semester = new Semestr(semesterName, LocalDateTime.now(), academicYear, savedDirection);
            semesters.add(semester);
        }

        // Save all semesters to the database
        semestrRepo.saveAll(semesters);

        return ResponseEntity.ok(savedDirection);
    }

    // Update an existing direction
    @PutMapping("/{id}")
    public HttpEntity<?> updateDirection(@PathVariable Integer id, @RequestBody Direction updatedDirection) {
        Optional<Direction> existingDirection = directionRepo.findById(id);
        if (existingDirection.isPresent()) {
            Direction direction = existingDirection.get();
            direction.setName(updatedDirection.getName());
            direction.setYear(updatedDirection.getYear());
            direction.setStatus(updatedDirection.getStatus());
            Direction savedDirection = directionRepo.save(direction);
            return ResponseEntity.ok(savedDirection);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a direction by ID
    @DeleteMapping("/{id}")
    public HttpEntity<?> deleteDirection(@PathVariable Integer id) {
        Optional<Direction> direction = directionRepo.findById(id);
        if (direction.isPresent()) {
            directionRepo.deleteById(id);
            return ResponseEntity.ok("Direction deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}