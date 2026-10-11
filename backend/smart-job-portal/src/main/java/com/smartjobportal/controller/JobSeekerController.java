package com.smartjobportal.controller;

import com.smartjobportal.dto.*;
import com.smartjobportal.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/jobseeker")
@RequiredArgsConstructor
public class JobSeekerController {

    private final DashboardService dashboardService;
    private final ProfileService profileService;
    private final ResumeService resumeService;

    @GetMapping("/dashboard")
    public ResponseEntity<JobSeekerDashboardDto> getDashboard(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(dashboardService.getJobSeekerDashboard(user.getUsername()));
    }

    @GetMapping("/profile")
    public ResponseEntity<JobSeekerProfileDto> getProfile(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(profileService.getJobSeekerProfile(user.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<JobSeekerProfileDto> updateProfile(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody JobSeekerProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateJobSeekerProfile(user.getUsername(), request));
    }

    @PostMapping("/resume")
    public ResponseEntity<ApiResponse> uploadResume(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam("file") MultipartFile file) {
        String fileName = resumeService.uploadResume(user.getUsername(), file);
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", fileName));
    }

    @GetMapping("/resume")
    public ResponseEntity<ApiResponse> getResumeInfo(@AuthenticationPrincipal UserDetails user) {
        String fileName = resumeService.getResumeFileName(user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Resume info", fileName));
    }

    @GetMapping("/resume/download")
    public ResponseEntity<Resource> downloadResume(@AuthenticationPrincipal UserDetails user) {
        Resource resource = resumeService.downloadResume(user.getUsername());
        String fileName = resumeService.getResumeFileName(user.getUsername());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @DeleteMapping("/resume")
    public ResponseEntity<ApiResponse> deleteResume(@AuthenticationPrincipal UserDetails user) {
        resumeService.deleteResume(user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully"));
    }
}
