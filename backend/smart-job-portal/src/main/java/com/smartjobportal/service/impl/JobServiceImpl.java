package com.smartjobportal.service.impl;

import com.smartjobportal.dto.JobDto;
import com.smartjobportal.dto.JobRequest;
import com.smartjobportal.dto.PagedResponse;
import com.smartjobportal.exception.BadRequestException;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.exception.UnauthorizedException;
import com.smartjobportal.model.*;
import com.smartjobportal.repository.JobRepository;
import com.smartjobportal.repository.UserRepository;
import com.smartjobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Override
    public PagedResponse<JobDto> getPublicJobs(String keyword, String company, String location,
                                                String jobType, String experience, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        JobType jt = null;
        if (jobType != null && !jobType.isBlank()) {
            try { jt = JobType.valueOf(jobType.toUpperCase()); } catch (IllegalArgumentException ignored) {}
        }
        Page<Job> jobPage = jobRepository.findActiveJobsWithFilters(
                blankToNull(keyword), blankToNull(company), blankToNull(location), jt, blankToNull(experience), pageable);
        return toPagedResponse(jobPage);
    }

    @Override
    public JobDto getPublicJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new ResourceNotFoundException("Job not found or inactive");
        }
        return toDto(job);
    }

    @Override
    @Transactional
    public JobDto createJob(JobRequest request, String recruiterEmail) {
        User recruiter = getUser(recruiterEmail);
        JobType jobType = parseJobType(request.getJobType());
        Job job = jobRepository.save(Job.builder()
                .recruiter(recruiter).title(request.getTitle()).companyName(request.getCompanyName())
                .location(request.getLocation()).jobType(jobType).salary(request.getSalary())
                .experienceRequired(request.getExperienceRequired()).skills(request.getSkills())
                .description(request.getDescription()).responsibilities(request.getResponsibilities())
                .qualifications(request.getQualifications()).applicationDeadline(request.getApplicationDeadline())
                .status(JobStatus.ACTIVE).build());
        return toDto(job);
    }

    @Override
    @Transactional
    public JobDto updateJob(Long id, JobRequest request, String recruiterEmail) {
        Job job = getOwnedJob(id, recruiterEmail);
        JobType jobType = parseJobType(request.getJobType());
        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setJobType(jobType);
        job.setSalary(request.getSalary());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setSkills(request.getSkills());
        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setQualifications(request.getQualifications());
        job.setApplicationDeadline(request.getApplicationDeadline());
        return toDto(jobRepository.save(job));
    }

    @Override
    @Transactional
    public void deleteJob(Long id, String recruiterEmail) {
        Job job = getOwnedJob(id, recruiterEmail);
        job.setStatus(JobStatus.INACTIVE);
        jobRepository.save(job);
    }

    @Override
    public PagedResponse<JobDto> getRecruiterJobs(String recruiterEmail, int page, int size) {
        User recruiter = getUser(recruiterEmail);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> jobPage = jobRepository.findByRecruiter(recruiter, pageable);
        return toPagedResponse(jobPage);
    }

    @Override
    public JobDto getRecruiterJobById(Long id, String recruiterEmail) {
        return toDto(getOwnedJob(id, recruiterEmail));
    }

    private Job getOwnedJob(Long id, String recruiterEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new UnauthorizedException("You do not own this job");
        }
        return job;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private JobType parseJobType(String jobType) {
        try {
            return JobType.valueOf(jobType.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid job type: " + jobType);
        }
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }

    private PagedResponse<JobDto> toPagedResponse(Page<Job> page) {
        return PagedResponse.<JobDto>builder()
                .content(page.getContent().stream().map(this::toDto).toList())
                .page(page.getNumber()).size(page.getSize())
                .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
                .last(page.isLast()).build();
    }

    public JobDto toDto(Job job) {
        return JobDto.builder()
                .id(job.getId()).recruiterId(job.getRecruiter().getId())
                .recruiterName(job.getRecruiter().getFullName())
                .title(job.getTitle()).companyName(job.getCompanyName())
                .location(job.getLocation()).jobType(job.getJobType() != null ? job.getJobType().name() : null)
                .salary(job.getSalary()).experienceRequired(job.getExperienceRequired())
                .skills(job.getSkills()).description(job.getDescription())
                .responsibilities(job.getResponsibilities()).qualifications(job.getQualifications())
                .applicationDeadline(job.getApplicationDeadline())
                .status(job.getStatus().name()).createdAt(job.getCreatedAt()).updatedAt(job.getUpdatedAt()).build();
    }
}
