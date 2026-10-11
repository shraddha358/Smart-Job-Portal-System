package com.smartjobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data @Builder
public class JobSeekerProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private LocalDate dateOfBirth;
    private String skills;
    private String education;
    private String experience;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String resumeFileName;
    private boolean hasResume;
}
