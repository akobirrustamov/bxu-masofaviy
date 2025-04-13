package com.example.backend.Controller;

import com.example.backend.DTO.RelationshipDTO;
import com.example.backend.Entity.Relationship;
import com.example.backend.Entity.Semestr;
import com.example.backend.Entity.Subject;
import com.example.backend.Repository.RelationshipRepo;
import com.example.backend.Repository.SemestrRepo;
import com.example.backend.Repository.SubjectRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/relationship")
public class RelationshipController {
    private final RelationshipRepo relationshipRepo;
    private final SubjectRepo subjectRepo;
    private final SemestrRepo semestrRepo;
    @GetMapping("/{semestrId}")
    public HttpEntity<?> findById(@PathVariable Integer semestrId) {
        System.out.println(semestrId);
        List<Relationship> relationshipList = relationshipRepo.findBySemestrId(semestrId);
        return  ResponseEntity.ok(relationshipList);
    }

    @PostMapping("/{semestrId}")
    public HttpEntity<?> addRelationship(@RequestBody RelationshipDTO relationshipDTO, @PathVariable Integer semestrId) {

        Optional<Subject> bySubject = subjectRepo.findById(relationshipDTO.getSubjectId());
        if(bySubject.isEmpty()){
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        if(bySubject.get().getSemesterCounts().size()>0){
            for (int i = 0; i < bySubject.get().getSemesterCounts().size(); i++) {
                System.out.println(semestrId);
                Optional<Semestr> byId = semestrRepo.findById(semestrId+i);
                if (byId.isEmpty()) {
                    return new ResponseEntity(HttpStatus.NOT_FOUND);
                }
                relationshipRepo.save(new Relationship(bySubject.get(), byId.get(), i+1));
            }
        }
        return ResponseEntity.ok("saved relationship");
    }

    @DeleteMapping("/{relationshipId}")
    public HttpEntity<?> deleteRelationship(@PathVariable Integer relationshipId) {
        Optional<Relationship> byId = relationshipRepo.findById(relationshipId);
        if (byId.isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);

        }
        relationshipRepo.deleteById(relationshipId);
        return ResponseEntity.ok("deleted relationship");

    }


}
