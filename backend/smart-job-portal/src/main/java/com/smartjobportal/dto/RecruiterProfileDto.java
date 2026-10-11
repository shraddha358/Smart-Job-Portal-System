package com.smartjobportal.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class RecruiterProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String companyLocation;
    private String linkedinUrl;
}
