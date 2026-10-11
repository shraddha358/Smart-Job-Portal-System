package com.smartjobportal.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data @Builder
public class JobSeekerDashboardDto {
    private long totalAvailableJobs;
    private long savedJobsCount;
    private long applicationsCount;
    private Map<String, Long> applicationStatusStats;
    private List<JobDto> recentJobs;
}
