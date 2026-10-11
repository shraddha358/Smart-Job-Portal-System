package com.smartjobportal.controller;

import com.smartjobportal.dto.*;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.model.Application;
import com.smartjobportal.repository.ApplicationRepository;
import com.smartjobportal.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final DashboardService dashboardService;
    private final ProfileService profileService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final ResumeService resumeService;
    private final ApplicationRepository applicationRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<RecruiterDashboardDto> getDashboard(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(dashboardService.getRecruiterDashboard(user.getUsername()));
    }

    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> getProfile(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(profileService.getRecruiterProfile(user.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> updateProfile(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody RecruiterProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateRecruiterProfile(user.getUsername(), request));
    }

    @GetMapping("/jobs")
    public ResponseEntity<PagedResponse<JobDto>> getMyJobs(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getRecruiterJobs(user.getUsername(), page, size));
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobDto> createJob(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.createJob(request, user.getUsername()));
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobDto> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(jobService.getRecruiterJobById(id, user.getUsername()));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<JobDto> updateJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.updateJob(id, request, user.getUsername()));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        jobService.deleteJob(id, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job deactivated successfully"));
    }

    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<List<ApplicationDto>> getApplicants(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(applicationService.getJobApplicants(jobId, user.getUsername()));
    }

    @PatchMapping("/applications/{applicationId}/status")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(
                applicationId, request.getStatus(), user.getUsername()));
    }

    @GetMapping("/applications/{applicationId}/resume")
    public ResponseEntity<Resource> downloadApplicantResume(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserDetails user) {
        // Verify recruiter owns this application's job
        applicationService.getApplicationById(applicationId, user.getUsername());
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (app.getResumeStorageName() == null) {
            return ResponseEntity.notFound().build();
        }
        Resource resource = resumeService.downloadResumeByStorageName(app.getResumeStorageName(), user.getUsername());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + app.getResumeFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
