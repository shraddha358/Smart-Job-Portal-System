package com.smartjobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder
public class JobDto {
    private Long id;
    private Long recruiterId;
    private String recruiterName;
    private String title;
    private String companyName;
    private String location;
    private String jobType;
    private String salary;
    private String experienceRequired;
    private String skills;
    private String description;
    private String responsibilities;
    private String qualifications;
    private LocalDate applicationDeadline;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
