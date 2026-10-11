package com.smartjobportal.dto;

import lombok.Data;

@Data
public class RecruiterProfileUpdateRequest {
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String companyLocation;
    private String linkedinUrl;
    private String phone;
}
