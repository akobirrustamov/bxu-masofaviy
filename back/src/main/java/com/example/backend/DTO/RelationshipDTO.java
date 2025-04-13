package com.example.backend.DTO;

import lombok.Data;

@Data
public class RelationshipDTO {
    private Integer id;
    private Integer subjectId;
    private String subjectName;
    private Integer semestrId;
}
