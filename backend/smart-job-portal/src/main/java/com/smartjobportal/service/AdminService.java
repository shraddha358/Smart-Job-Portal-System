package com.smartjobportal.service;

import com.smartjobportal.dto.*;

public interface AdminService {
    PagedResponse<UserDto> getUsers(String search, String role, String status, int page, int size);
    UserDto getUserById(Long id);
    UserDto updateUserStatus(Long id, String status);
    void deleteUser(Long id);
    PagedResponse<JobDto> getJobs(String keyword, String status, int page, int size);
    JobDto updateJobStatus(Long id, String status);
    void deleteJob(Long id);
    PagedResponse<ApplicationDto> getApplications(String status, int page, int size);
    ApplicationDto updateApplicationStatus(Long id, String status);
    void deleteApplication(Long id);
}
