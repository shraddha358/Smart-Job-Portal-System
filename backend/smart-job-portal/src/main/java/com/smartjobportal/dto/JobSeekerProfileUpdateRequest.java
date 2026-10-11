package com.smartjobportal.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class JobSeekerProfileUpdateRequest {
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
    private String phone;
}
