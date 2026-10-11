package com.smartjobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class ApplicationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private String jobType;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String applicantSkills;
    private String resumeFileName;
    private boolean hasResume;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
