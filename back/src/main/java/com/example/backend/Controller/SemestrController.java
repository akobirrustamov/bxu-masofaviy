package com.example.backend.Controller;

import com.example.backend.Entity.Semestr;
import com.example.backend.Repository.SemestrRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/semester")
public class SemestrController {
    private final SemestrRepo semestrRepo;

    @GetMapping("/{id}")
    public HttpEntity<?> findById(@PathVariable Integer id) {
        Semestr semestr = semestrRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return  ResponseEntity.ok(semestr);

    }
}
