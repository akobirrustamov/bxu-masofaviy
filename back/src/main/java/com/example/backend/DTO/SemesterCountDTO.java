package com.example.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SemesterCountDTO {
    private Integer semester;
    private Integer maruzaCount;
    private Integer seminarCount;
    private Integer amaliyCount;
    private Integer labaratoriyaCount;
}