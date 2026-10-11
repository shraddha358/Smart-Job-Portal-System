package com.smartjobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class RecruiterDashboardDto {
    private long totalJobsPosted;
    private long activeJobs;
    private long totalApplicants;
    private long pendingApplications;
    private long selectedCandidates;
    private long rejectedCandidates;
    private List<JobDto> recentJobs;
    private List<ApplicationDto> recentApplications;
}
