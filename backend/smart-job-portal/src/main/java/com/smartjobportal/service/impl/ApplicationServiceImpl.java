package com.smartjobportal.service.impl;

import com.smartjobportal.dto.ApplicationDto;
import com.smartjobportal.exception.BadRequestException;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.exception.UnauthorizedException;
import com.smartjobportal.model.*;
import com.smartjobportal.repository.*;
import com.smartjobportal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;

    @Override
    @Transactional
    public ApplicationDto applyForJob(Long jobId, String applicantEmail) {
        User applicant = getUser(applicantEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job is no longer accepting applications");
        }
        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            throw new BadRequestException("You have already applied for this job");
        }
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser(applicant)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        if (profile.getResumeStorageName() == null) {
            throw new BadRequestException("Please upload your resume before applying");
        }
        Application application = applicationRepository.save(Application.builder()
                .job(job).applicant(applicant)
                .resumeStorageName(profile.getResumeStorageName())
                .resumeFileName(profile.getResumeFileName())
                .status(ApplicationStatus.APPLIED).build());
        return toDto(application);
    }

    @Override
    public List<ApplicationDto> getMyApplications(String applicantEmail) {
        User applicant = getUser(applicantEmail);
        return applicationRepository.findByApplicant(applicant).stream().map(this::toDto).toList();
    }

    @Override
    public ApplicationDto getApplicationById(Long id, String requesterEmail) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        User requester = getUser(requesterEmail);
        boolean isApplicant = app.getApplicant().getId().equals(requester.getId());
        boolean isRecruiter = app.getJob().getRecruiter().getId().equals(requester.getId());
        boolean isAdmin = requester.getRole() == Role.ADMIN;
        if (!isApplicant && !isRecruiter && !isAdmin) {
            throw new UnauthorizedException("Access denied");
        }
        return toDto(app);
    }

    @Override
    public List<ApplicationDto> getJobApplicants(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new UnauthorizedException("You do not own this job");
        }
        return applicationRepository.findByJob(job).stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, String status, String recruiterEmail) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (!app.getJob().getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new UnauthorizedException("You do not own this application");
        }
        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }
        if (newStatus == ApplicationStatus.APPLIED) {
            throw new BadRequestException("Cannot revert to APPLIED status");
        }
        app.setStatus(newStatus);
        return toDto(applicationRepository.save(app));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public ApplicationDto toDto(Application a) {
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser(a.getApplicant()).orElse(null);
        return ApplicationDto.builder()
                .id(a.getId()).jobId(a.getJob().getId())
                .jobTitle(a.getJob().getTitle()).companyName(a.getJob().getCompanyName())
                .location(a.getJob().getLocation())
                .jobType(a.getJob().getJobType() != null ? a.getJob().getJobType().name() : null)
                .applicantId(a.getApplicant().getId()).applicantName(a.getApplicant().getFullName())
                .applicantEmail(a.getApplicant().getEmail()).applicantPhone(a.getApplicant().getPhone())
                .applicantSkills(profile != null ? profile.getSkills() : null)
                .resumeFileName(a.getResumeFileName()).hasResume(a.getResumeStorageName() != null)
                .status(a.getStatus().name()).appliedAt(a.getAppliedAt()).updatedAt(a.getUpdatedAt()).build();
    }
}
