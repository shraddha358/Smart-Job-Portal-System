package com.smartjobportal.service;

import com.smartjobportal.dto.JobDto;
import com.smartjobportal.dto.JobRequest;
import com.smartjobportal.dto.PagedResponse;

public interface JobService {
    PagedResponse<JobDto> getPublicJobs(String keyword, String company, String location,
                                        String jobType, String experience, int page, int size, String sort);
    JobDto getPublicJobById(Long id);
    JobDto createJob(JobRequest request, String recruiterEmail);
    JobDto updateJob(Long id, JobRequest request, String recruiterEmail);
    void deleteJob(Long id, String recruiterEmail);
    PagedResponse<JobDto> getRecruiterJobs(String recruiterEmail, int page, int size);
    JobDto getRecruiterJobById(Long id, String recruiterEmail);
}
