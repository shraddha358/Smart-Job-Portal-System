package com.smartjobportal.controller;

import com.smartjobportal.dto.*;
import com.smartjobportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobService savedJobService;

    @GetMapping
    public ResponseEntity<List<SavedJobDto>> getSavedJobs(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(savedJobService.getSavedJobs(user.getUsername()));
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<SavedJobDto> saveJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(savedJobService.saveJob(jobId, user.getUsername()));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResponse> unsaveJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails user) {
        savedJobService.unsaveJob(jobId, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job removed from saved list"));
    }
}
