package com.smartjobportal.service.impl;

import com.smartjobportal.dto.SavedJobDto;
import com.smartjobportal.exception.BadRequestException;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.model.*;
import com.smartjobportal.repository.*;
import com.smartjobportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    @Transactional
    public SavedJobDto saveJob(Long jobId, String userEmail) {
        User user = getUser(userEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (savedJobRepository.existsByUserAndJob(user, job)) {
            throw new BadRequestException("Job already saved");
        }
        SavedJob saved = savedJobRepository.save(SavedJob.builder().user(user).job(job).build());
        return toDto(saved, user);
    }

    @Override
    @Transactional
    public void unsaveJob(Long jobId, String userEmail) {
        User user = getUser(userEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!savedJobRepository.existsByUserAndJob(user, job)) {
            throw new ResourceNotFoundException("Saved job not found");
        }
        savedJobRepository.deleteByUserAndJob(user, job);
    }

    @Override
    public List<SavedJobDto> getSavedJobs(String userEmail) {
        User user = getUser(userEmail);
        return savedJobRepository.findByUser(user).stream()
                .map(sj -> toDto(sj, user)).toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private SavedJobDto toDto(SavedJob sj, User user) {
        Job job = sj.getJob();
        boolean applied = applicationRepository.existsByJobAndApplicant(job, user);
        return SavedJobDto.builder()
                .id(sj.getId()).jobId(job.getId()).jobTitle(job.getTitle())
                .companyName(job.getCompanyName()).location(job.getLocation())
                .jobType(job.getJobType() != null ? job.getJobType().name() : null)
                .salary(job.getSalary()).experienceRequired(job.getExperienceRequired())
                .status(job.getStatus().name()).savedAt(sj.getSavedAt()).alreadyApplied(applied).build();
    }
}
