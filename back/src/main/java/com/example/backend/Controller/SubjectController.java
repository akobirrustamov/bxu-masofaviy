package com.example.backend.Controller;

import com.example.backend.DTO.SemesterCountDTO;
import com.example.backend.DTO.SubjectDTO;
import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/subject")
public class SubjectController {
    private final SubjectRepo subjectRepo;
    private final SubjectSemesterCountRepo subjectSemesterCountRepo;
    private final LessonRepo lessonRepo;
    private final AttachmentRepo attachmentRepo;

    @GetMapping
    public ResponseEntity<List<Subject>> getSubjects() {
        List<Subject> subjects = subjectRepo.findAllWithSemesterCounts();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/{id}")
    public HttpEntity<?> getSubjectById(@PathVariable Integer id) {
        Optional<Subject> subject = subjectRepo.findById(id);
        if (subject.isPresent()) {
            return ResponseEntity.ok(subject.get());
        } else {
            return ResponseEntity.badRequest().body("Subject not found");
        }
    }

    @GetMapping("/{id}/lessons")
    public HttpEntity<?> getLessonsBySubjectId(@PathVariable Integer id) {
        System.out.println(id);
        List<Lesson> lessons = lessonRepo.findBySubjectId(id);
        if (lessons.isEmpty()) {
            return ResponseEntity.badRequest().body("No lessons found for this subject");
        }
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/semester/{semesterId}")
    public HttpEntity<?> getSubjectsBySemesterId(@PathVariable Integer semesterId) {
        List<Subject> subjects = subjectRepo.findBySemesterCounts_Semester(semesterId);
        return ResponseEntity.ok(subjects);
    }

    @PostMapping
    public HttpEntity<?> addSubject(@RequestBody SubjectDTO subjectDTO) {
        // Create and save the subject
        Subject newSubject = new Subject();
        newSubject.setName(subjectDTO.getName());
        newSubject.setCreatedAt(LocalDateTime.now());
        Subject savedSubject = subjectRepo.save(newSubject);

        // Save semester counts
        List<SubjectSemesterCount> semesterCounts = new ArrayList<>();
        for (SemesterCountDTO semesterCountDTO : subjectDTO.getSemesterCounts()) {
            SubjectSemesterCount semesterCount = SubjectSemesterCount.builder()
                    .semester(semesterCountDTO.getSemester())
                    .maruzaCount(semesterCountDTO.getMaruzaCount())
                    .seminarCount(semesterCountDTO.getSeminarCount())
                    .amaliyCount(semesterCountDTO.getAmaliyCount())
                    .labaratoriyaCount(semesterCountDTO.getLabaratoriyaCount())
                    .subject(savedSubject)
                    .build();
            semesterCounts.add(semesterCount);
        }
        subjectSemesterCountRepo.saveAll(semesterCounts);

        // Create lessons based on the counts for each semester
        List<Lesson> lessons = new ArrayList<>();
        for (SubjectSemesterCount semesterCount : semesterCounts) {
            // Create maruza lessons
            for (int i = 1; i <= semesterCount.getMaruzaCount(); i++) {
                Lesson lesson = new Lesson();
                lesson.setLessonOrder(i);
                lesson.setName("");
                lesson.setLessonType(1); // 1 for maruza
                lesson.setCreatedAt(LocalDateTime.now());
                lesson.setSubject(savedSubject);
                lesson.setSubjectSemester(semesterCount.getSemester());
                lessons.add(lesson);
            }

            // Create seminar lessons
            for (int i = 1; i <= semesterCount.getSeminarCount(); i++) {
                Lesson lesson = new Lesson();
                lesson.setLessonOrder(i);
                lesson.setName("");
                lesson.setLessonType(2); // 2 for seminar
                lesson.setCreatedAt(LocalDateTime.now());
                lesson.setSubject(savedSubject);
                lesson.setSubjectSemester(semesterCount.getSemester());
                lessons.add(lesson);
            }

            // Create amaliy lessons
            for (int i = 1; i <= semesterCount.getAmaliyCount(); i++) {
                Lesson lesson = new Lesson();
                lesson.setLessonOrder(i);
                lesson.setName("");
                lesson.setLessonType(3); // 3 for amaliy
                lesson.setCreatedAt(LocalDateTime.now());
                lesson.setSubject(savedSubject);
                lesson.setSubjectSemester(semesterCount.getSemester());
                lessons.add(lesson);
            }

            // Create labaratoriya lessons
            for (int i = 1; i <= semesterCount.getLabaratoriyaCount(); i++) {
                Lesson lesson = new Lesson();
                lesson.setLessonOrder(i);
                lesson.setName("");
                lesson.setLessonType(4); // 4 for labaratoriya
                lesson.setCreatedAt(LocalDateTime.now());
                lesson.setSubject(savedSubject);
                lesson.setSubjectSemester(semesterCount.getSemester());
                lessons.add(lesson);
            }
        }

        // Save all lessons
        lessonRepo.saveAll(lessons);

        return ResponseEntity.ok(savedSubject);
    }

    @PutMapping("/{id}/oquv-dasturi-pdf/{fileId}")
    public HttpEntity<?> updateSubjectOquvDasturi(@PathVariable Integer id, @PathVariable UUID fileId) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        Optional<Attachment> attachment = attachmentRepo.findById(fileId);
        if (attachment.isEmpty()) {
            return ResponseEntity.badRequest().body("Attachment not found");
        }
        subject.setOquvDasturiPdf(attachment.get());
        return ResponseEntity.ok(subjectRepo.save(subject));
    }


    @PutMapping("/{id}/sillabus-pdf/{fileId}")
    public HttpEntity<?> updateSubjectSillabus(@PathVariable Integer id, @PathVariable UUID fileId) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        Optional<Attachment> attachment = attachmentRepo.findById(fileId);
        if (attachment.isEmpty()) {
            return ResponseEntity.badRequest().body("Attachment not found");
        }
        subject.setSillabusPdf(attachment.get());
        return ResponseEntity.ok(subjectRepo.save(subject));
    }

    @PutMapping("/{id}/oquv-dasturi-word/{fileId}")
    public HttpEntity<?> updateSubjectOquvDasturiW(@PathVariable Integer id, @PathVariable UUID fileId) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        Optional<Attachment> attachment = attachmentRepo.findById(fileId);
        if (attachment.isEmpty()) {
            return ResponseEntity.badRequest().body("Attachment not found");
        }
        subject.setOquvDasturiWord(attachment.get());
        return ResponseEntity.ok(subjectRepo.save(subject));
    }

    @PutMapping("/{id}/sillabus-word/{fileId}")
    public HttpEntity<?> updateSubjectSillabusW(@PathVariable Integer id, @PathVariable UUID fileId) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        Optional<Attachment> attachment = attachmentRepo.findById(fileId);
        if (attachment.isEmpty()) {
            return ResponseEntity.badRequest().body("Attachment not found");
        }
        subject.setSillabusWord(attachment.get());
        return ResponseEntity.ok(subjectRepo.save(subject));
    }

    @PutMapping("/{id}/namunaviy-dastur/{fileId}")
    public HttpEntity<?> updateSubjectNamunaviyDastur(@PathVariable Integer id, @PathVariable UUID fileId) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        Optional<Attachment> attachment = attachmentRepo.findById(fileId);
        if (attachment.isEmpty()) {
            return ResponseEntity.badRequest().body("Attachment not found");
        }
        subject.setNamunaviyDastur(attachment.get());
        return ResponseEntity.ok(subjectRepo.save(subject));
    }

    @PutMapping("/{id}/name")
    public HttpEntity<?> updateSubjectName(@PathVariable Integer id, @RequestParam String name) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        subject.setName(name);
        return ResponseEntity.ok(subjectRepo.save(subject));
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> deleteSubject(@PathVariable Integer id) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        subjectRepo.delete(subject);
        return ResponseEntity.ok("Subject deleted successfully");
    }


    @DeleteMapping("/{id}/sillabus-pdf")
    public HttpEntity<?> deleteSubjectSillabusPdf(@PathVariable Integer id) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        UUID fileId = subject.getSillabusPdf().getId();
        subject.setSillabusPdf(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        subjectRepo.save(subject);
        attachmentRepo.deleteById(fileId);
        return ResponseEntity.ok("Subject deleted successfully");
    }
    @DeleteMapping("/{id}/sillabus-word")
    public HttpEntity<?> deleteSubjectSillabusWord(@PathVariable Integer id) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        UUID fileId = subject.getSillabusWord().getId();
        subject.setSillabusWord(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        subjectRepo.save(subject);
        attachmentRepo.deleteById(fileId);
        return ResponseEntity.ok("Subject deleted successfully");
    }

    @DeleteMapping("/{id}/oquv-dasturi-pdf")
    public HttpEntity<?> deleteSubjectDasturPdf(@PathVariable Integer id) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        UUID fileId = subject.getOquvDasturiPdf().getId();
        subject.setOquvDasturiPdf(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        subjectRepo.save(subject);
        attachmentRepo.deleteById(fileId);
        return ResponseEntity.ok("Subject deleted successfully");
    }
    @DeleteMapping("/{id}/oquv-dasturi-word")
    public HttpEntity<?> deleteSubjectDasturWord(@PathVariable Integer id) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        UUID fileId = subject.getOquvDasturiWord().getId();
        subject.setOquvDasturiWord(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        subjectRepo.save(subject);
        attachmentRepo.deleteById(fileId);
        return ResponseEntity.ok("Subject deleted successfully");
    }
    @DeleteMapping("/{id}/namunaviy-dastur")
    public HttpEntity<?> deleteSubjectnamunaviyPdf(@PathVariable Integer id) {
        Subject subject = subjectRepo.findById(id).orElse(null);
        UUID fileId = subject.getNamunaviyDastur().getId();
        subject.setNamunaviyDastur(null);
        if (subject == null) {
            return ResponseEntity.badRequest().body("Subject not found");
        }
        subjectRepo.save(subject);
        attachmentRepo.deleteById(fileId);
        return ResponseEntity.ok("Subject deleted successfully");
    }
}