package com.smartjobportal.service;

import com.smartjobportal.dto.AdminDashboardDto;
import com.smartjobportal.dto.JobSeekerDashboardDto;
import com.smartjobportal.dto.RecruiterDashboardDto;

public interface DashboardService {
    JobSeekerDashboardDto getJobSeekerDashboard(String email);
    RecruiterDashboardDto getRecruiterDashboard(String email);
    AdminDashboardDto getAdminDashboard();
}
