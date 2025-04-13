package com.example.backend.Controller;

import com.example.backend.DTO.LessonDTO;
import com.example.backend.Entity.Attachment;
import com.example.backend.Entity.Lesson;
import com.example.backend.Repository.AttachmentRepo;
import com.example.backend.Repository.LessonRepo;
import com.example.backend.Services.AttachmentService.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/lesson")
public class LessonController {
    private final LessonRepo lessonRepo;
    private final AttachmentRepo attachmentRepo;
    private final AttachmentService attachmentService;

    // Existing method to get lessons by subjectId
    @GetMapping("/{subjectId}")
    public HttpEntity<?> getLessonBySubjectId(@RequestParam("subjectId") Integer subjectId) {
        List<Lesson> all = lessonRepo.findAllBySubjectId(subjectId);
        return ResponseEntity.ok(all);
    }

    @PutMapping("/{id}/matni/{fileId}")
    public HttpEntity<?> updateMatniAttachment(@PathVariable Integer id, @PathVariable UUID fileId) {
        return updateAttachment(id, fileId, "matni");
    }
    @PutMapping("/{id}/taqdimot/{fileId}")
    public HttpEntity<?> updateTaqdimotAttachment(@PathVariable Integer id, @PathVariable UUID fileId) {
        return updateAttachment(id, fileId, "taqdimot");
    }
    @PutMapping("/{id}/test/{fileId}")
    public HttpEntity<?> updateTestAttachment(@PathVariable Integer id, @PathVariable UUID fileId) {
        return updateAttachment(id, fileId, "test");
    }

    @PutMapping("/{id}/glossary/{fileId}")
    public HttpEntity<?> updateGlossaryAttachment(@PathVariable Integer id, @PathVariable UUID fileId) {
        return updateAttachment(id, fileId, "glossary");
    }
    @PutMapping("/{id}/amaliy/{fileId}")
    public HttpEntity<?> updateAmaliyAttachment(@PathVariable Integer id, @PathVariable UUID fileId) {
        return updateAttachment(id, fileId, "amaliy");
    }

    @PutMapping("/{id}/qoshimcha/{fileId}")
    public HttpEntity<?> updateQoshimchaAttachment(@PathVariable Integer id, @PathVariable UUID fileId) {
        return updateAttachment(id, fileId, "qoshimcha");
    }

    private HttpEntity<?> updateAttachment(Integer id, UUID fileId, String fieldName) {
        Lesson lesson = lessonRepo.findById(id).orElse(null);
        if (lesson == null) {
            return ResponseEntity.badRequest().body("Lesson not found");
        }

        Optional<Attachment> attachment = attachmentRepo.findById(fileId);
        if (attachment.isEmpty()) {
            return ResponseEntity.badRequest().body("Attachment not found");
        }

        switch (fieldName) {
            case "matni":
                lesson.setMatni(attachment.get());
                break;
            case "taqdimot":
                lesson.setTaqdimot(attachment.get());
                break;
            case "test":
                lesson.setTest(attachment.get());
                break;
            case "glossary":
                lesson.setGlossary(attachment.get());
                break;
            case "amaliy":
                lesson.setAmaliy(attachment.get());
                break;
            case "qoshimcha":
                lesson.setQoshimcha(attachment.get());
                break;
            default:
                return ResponseEntity.badRequest().body("Invalid field name");
        }

        return ResponseEntity.ok(lessonRepo.save(lesson));
    }

    @DeleteMapping("/{lessonId}/matni")
    public HttpEntity<?> deleteMatniAttachment(@PathVariable Integer lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElse(null);
        UUID fileId = lesson.getMatni().getId();
        lesson.setMatni(null);
        attachmentService.deleteFile(fileId);
        lessonRepo.save(lesson);
        return ResponseEntity.ok(lessonRepo.save(lesson));
    }

    @DeleteMapping("/{lessonId}/taqdimot")
    public HttpEntity<?> deleteTaqdimotAttachment(@PathVariable Integer lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElse(null);
        UUID fileId = lesson.getTaqdimot().getId();
        lesson.setTaqdimot(null);
        attachmentService.deleteFile(fileId);
        lessonRepo.save(lesson);
        return ResponseEntity.ok(lessonRepo.save(lesson));
    }

    @DeleteMapping("/{lessonId}/test")
    public HttpEntity<?> deleteTestAttachment(@PathVariable Integer lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElse(null);
        UUID fileId = lesson.getTest().getId();
        lesson.setTest(null);
        attachmentService.deleteFile(fileId);
        lessonRepo.save(lesson);
        return ResponseEntity.ok(lessonRepo.save(lesson));
    }

    @DeleteMapping("/{lessonId}/glossary")
    public HttpEntity<?> deleteGlossaryAttachment(@PathVariable Integer lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElse(null);
        UUID fileId = lesson.getGlossary().getId();
        lesson.setGlossary(null);
        attachmentService.deleteFile(fileId);
        lessonRepo.save(lesson);
        return ResponseEntity.ok(lessonRepo.save(lesson));
    }
    @DeleteMapping("/{lessonId}/amaliy")
    public HttpEntity<?> deleteAmaliyAttachment(@PathVariable Integer lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElse(null);
        UUID fileId = lesson.getAmaliy().getId();
        lesson.setAmaliy(null);
        attachmentService.deleteFile(fileId);
        lesson.setAmaliy(null);
        lessonRepo.save(lesson);
        return ResponseEntity.ok(lessonRepo.save(lesson));
    }

    @DeleteMapping("/{lessonId}/qoshimcha")
    public HttpEntity<?> deleteQoshimchaAttachment(@PathVariable Integer lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElse(null);
        UUID fileId = lesson.getQoshimcha().getId();
        lesson.setQoshimcha(null);
        attachmentService.deleteFile(fileId);
        lessonRepo.save(lesson);
        return ResponseEntity.ok(lessonRepo.save(lesson));
    }
    @PutMapping("/edit/{lessonId}")
    public HttpEntity<?> updateLesson(@PathVariable Integer lessonId, @RequestBody LessonDTO lesson) {
        System.out.println(lessonId);
        Lesson lesson1 = lessonRepo.findById(lessonId).orElse(null);
        lesson1.setName(lesson.getName());
        lesson1.setYoutubeIframeLink(lesson.getYoutubeIframeLink());
        lessonRepo.save(lesson1);
        return ResponseEntity.ok("updated lesson");
    }
}
