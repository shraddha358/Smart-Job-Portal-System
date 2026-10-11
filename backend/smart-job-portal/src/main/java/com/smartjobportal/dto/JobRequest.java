package com.smartjobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String location;

    @NotNull(message = "Job type is required")
    private String jobType;

    private String salary;
    private String experienceRequired;
    private String skills;

    @NotBlank(message = "Description is required")
    private String description;

    private String responsibilities;
    private String qualifications;
    private LocalDate applicationDeadline;
}
