package com.smartjobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class SavedJobDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private String jobType;
    private String salary;
    private String experienceRequired;
    private String status;
    private LocalDateTime savedAt;
    private boolean alreadyApplied;
}
