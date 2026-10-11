package com.smartjobportal.controller;

import com.smartjobportal.dto.*;
import com.smartjobportal.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationDto> apply(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyForJob(request.getJobId(), user.getUsername()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationDto>> getMyApplications(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(applicationService.getMyApplications(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(applicationService.getApplicationById(id, user.getUsername()));
    }
}
