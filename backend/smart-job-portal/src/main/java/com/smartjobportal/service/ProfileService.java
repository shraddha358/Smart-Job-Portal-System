package com.smartjobportal.service;

import com.smartjobportal.dto.*;

public interface ProfileService {
    JobSeekerProfileDto getJobSeekerProfile(String email);
    JobSeekerProfileDto updateJobSeekerProfile(String email, JobSeekerProfileUpdateRequest request);
    RecruiterProfileDto getRecruiterProfile(String email);
    RecruiterProfileDto updateRecruiterProfile(String email, RecruiterProfileUpdateRequest request);
}
