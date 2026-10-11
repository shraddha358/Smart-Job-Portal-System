package com.smartjobportal.controller;

import com.smartjobportal.dto.JobDto;
import com.smartjobportal.dto.PagedResponse;
import com.smartjobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class PublicJobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<PagedResponse<JobDto>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experience,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort) {
        return ResponseEntity.ok(jobService.getPublicJobs(keyword, company, location, jobType, experience, page, size, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getPublicJobById(id));
    }
}
