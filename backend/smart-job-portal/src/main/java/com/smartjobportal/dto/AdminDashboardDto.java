package com.smartjobportal.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AdminDashboardDto {
    private long totalUsers;
    private long totalJobSeekers;
    private long totalRecruiters;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long pendingApplications;
}
