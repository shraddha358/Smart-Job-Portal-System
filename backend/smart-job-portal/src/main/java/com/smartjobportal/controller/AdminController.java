package com.smartjobportal.controller;

import com.smartjobportal.dto.*;
import com.smartjobportal.service.AdminService;
import com.smartjobportal.service.DashboardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/users")
    public ResponseEntity<PagedResponse<UserDto>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getUsers(search, role, status, page, size));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserDto> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, request.getStatus()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    @GetMapping("/jobs")
    public ResponseEntity<PagedResponse<JobDto>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getJobs(keyword, status, page, size));
    }

    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<JobDto> updateJobStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateJobStatus(id, request.getStatus()));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse> deleteJob(@PathVariable Long id) {
        adminService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job deactivated successfully"));
    }

    @GetMapping("/applications")
    public ResponseEntity<PagedResponse<ApplicationDto>> getApplications(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getApplications(status, page, size));
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateApplicationStatus(id, request.getStatus()));
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<ApiResponse> deleteApplication(@PathVariable Long id) {
        adminService.deleteApplication(id);
        return ResponseEntity.ok(ApiResponse.success("Application deleted successfully"));
    }
}
