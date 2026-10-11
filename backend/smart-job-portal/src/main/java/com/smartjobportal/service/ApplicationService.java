package com.smartjobportal.service;

import com.smartjobportal.dto.ApplicationDto;
import com.smartjobportal.dto.PagedResponse;

import java.util.List;

public interface ApplicationService {
    ApplicationDto applyForJob(Long jobId, String applicantEmail);
    List<ApplicationDto> getMyApplications(String applicantEmail);
    ApplicationDto getApplicationById(Long id, String requesterEmail);
    List<ApplicationDto> getJobApplicants(Long jobId, String recruiterEmail);
    ApplicationDto updateApplicationStatus(Long applicationId, String status, String recruiterEmail);
}
