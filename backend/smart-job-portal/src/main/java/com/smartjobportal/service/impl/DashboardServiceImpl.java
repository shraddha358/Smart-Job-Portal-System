package com.smartjobportal.service.impl;

import com.smartjobportal.dto.*;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.model.*;
import com.smartjobportal.repository.*;
import com.smartjobportal.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final JobServiceImpl jobService;
    private final ApplicationServiceImpl applicationService;

    @Override
    public JobSeekerDashboardDto getJobSeekerDashboard(String email) {
        User user = getUser(email);
        long totalJobs = jobRepository.countByStatus(JobStatus.ACTIVE);
        long savedCount = savedJobRepository.countByUser(user);
        long appCount = applicationRepository.countByApplicant(user);
        Map<String, Long> stats = Map.of(
                "APPLIED", applicationRepository.countByApplicantAndStatus(user, ApplicationStatus.APPLIED),
                "UNDER_REVIEW", applicationRepository.countByApplicantAndStatus(user, ApplicationStatus.UNDER_REVIEW),
                "SHORTLISTED", applicationRepository.countByApplicantAndStatus(user, ApplicationStatus.SHORTLISTED),
                "INTERVIEW", applicationRepository.countByApplicantAndStatus(user, ApplicationStatus.INTERVIEW),
                "SELECTED", applicationRepository.countByApplicantAndStatus(user, ApplicationStatus.SELECTED),
                "REJECTED", applicationRepository.countByApplicantAndStatus(user, ApplicationStatus.REJECTED)
        );
        var recentJobs = jobRepository.findTop5ByStatusOrderByCreatedAtDesc(JobStatus.ACTIVE)
                .stream().map(jobService::toDto).toList();
        return JobSeekerDashboardDto.builder()
                .totalAvailableJobs(totalJobs).savedJobsCount(savedCount)
                .applicationsCount(appCount).applicationStatusStats(stats)
                .recentJobs(recentJobs).build();
    }

    @Override
    public RecruiterDashboardDto getRecruiterDashboard(String email) {
        User recruiter = getUser(email);
        long totalJobs = jobRepository.countByRecruiter(recruiter);
        long activeJobs = jobRepository.countByRecruiterAndStatus(recruiter, JobStatus.ACTIVE);
        long totalApplicants = applicationRepository.countByJobRecruiter(recruiter);
        long pending = applicationRepository.countByJobRecruiterAndStatus(recruiter, ApplicationStatus.APPLIED);
        long selected = applicationRepository.countByJobRecruiterAndStatus(recruiter, ApplicationStatus.SELECTED);
        long rejected = applicationRepository.countByJobRecruiterAndStatus(recruiter, ApplicationStatus.REJECTED);
        var recentJobs = jobRepository.findByRecruiter(recruiter).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5).map(jobService::toDto).toList();
        var recentApps = applicationRepository.findRecentByRecruiter(recruiter, PageRequest.of(0, 5))
                .stream().map(applicationService::toDto).toList();
        return RecruiterDashboardDto.builder()
                .totalJobsPosted(totalJobs).activeJobs(activeJobs).totalApplicants(totalApplicants)
                .pendingApplications(pending).selectedCandidates(selected).rejectedCandidates(rejected)
                .recentJobs(recentJobs).recentApplications(recentApps).build();
    }

    @Override
    public AdminDashboardDto getAdminDashboard() {
        long totalUsers = userRepository.count();
        long seekers = userRepository.countByRole(Role.JOB_SEEKER);
        long recruiters = userRepository.countByRole(Role.RECRUITER);
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.ACTIVE);
        long totalApps = applicationRepository.count();
        long pendingApps = applicationRepository.countByStatus(ApplicationStatus.APPLIED);
        return AdminDashboardDto.builder()
                .totalUsers(totalUsers).totalJobSeekers(seekers).totalRecruiters(recruiters)
                .totalJobs(totalJobs).activeJobs(activeJobs)
                .totalApplications(totalApps).pendingApplications(pendingApps).build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
