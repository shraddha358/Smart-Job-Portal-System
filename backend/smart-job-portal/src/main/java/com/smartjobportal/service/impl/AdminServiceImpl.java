package com.smartjobportal.service.impl;

import com.smartjobportal.dto.*;
import com.smartjobportal.exception.BadRequestException;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.model.*;
import com.smartjobportal.repository.*;
import com.smartjobportal.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobServiceImpl jobService;
    private final ApplicationServiceImpl applicationService;

    @Override
    public PagedResponse<UserDto> getUsers(String search, String role, String status, int page, int size) {
        Role roleEnum = parseEnum(role, Role.class);
        UserStatus statusEnum = parseEnum(status, UserStatus.class);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage = userRepository.findWithFilters(
                blankToNull(search), roleEnum, statusEnum, pageable);
        return PagedResponse.<UserDto>builder()
                .content(userPage.getContent().stream().map(this::toUserDto).toList())
                .page(userPage.getNumber()).size(userPage.getSize())
                .totalElements(userPage.getTotalElements()).totalPages(userPage.getTotalPages())
                .last(userPage.isLast()).build();
    }

    @Override
    public UserDto getUserById(Long id) {
        return toUserDto(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Override
    @Transactional
    public UserDto updateUserStatus(Long id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserStatus newStatus;
        try { newStatus = UserStatus.valueOf(status.toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + status); }
        if (user.getRole() == Role.ADMIN && newStatus == UserStatus.INACTIVE) {
            long activeAdmins = userRepository.countByRoleAndStatus(Role.ADMIN, UserStatus.ACTIVE);
            if (activeAdmins <= 1) throw new BadRequestException("Cannot deactivate the last active admin");
        }
        user.setStatus(newStatus);
        return toUserDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == Role.ADMIN) throw new BadRequestException("Cannot delete admin accounts");
        userRepository.delete(user);
    }

    @Override
    public PagedResponse<JobDto> getJobs(String keyword, String status, int page, int size) {
        JobStatus statusEnum = parseEnum(status, JobStatus.class);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> jobPage = jobRepository.findAdminJobsWithFilters(blankToNull(keyword), statusEnum, pageable);
        return PagedResponse.<JobDto>builder()
                .content(jobPage.getContent().stream().map(jobService::toDto).toList())
                .page(jobPage.getNumber()).size(jobPage.getSize())
                .totalElements(jobPage.getTotalElements()).totalPages(jobPage.getTotalPages())
                .last(jobPage.isLast()).build();
    }

    @Override
    @Transactional
    public JobDto updateJobStatus(Long id, String status) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        JobStatus newStatus;
        try { newStatus = JobStatus.valueOf(status.toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + status); }
        job.setStatus(newStatus);
        return jobService.toDto(jobRepository.save(job));
    }

    @Override
    @Transactional
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        job.setStatus(JobStatus.INACTIVE);
        jobRepository.save(job);
    }

    @Override
    public PagedResponse<ApplicationDto> getApplications(String status, int page, int size) {
        ApplicationStatus statusEnum = parseEnum(status, ApplicationStatus.class);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        Page<Application> appPage = applicationRepository.findAdminApplications(statusEnum, pageable);
        return PagedResponse.<ApplicationDto>builder()
                .content(appPage.getContent().stream().map(applicationService::toDto).toList())
                .page(appPage.getNumber()).size(appPage.getSize())
                .totalElements(appPage.getTotalElements()).totalPages(appPage.getTotalPages())
                .last(appPage.isLast()).build();
    }

    @Override
    @Transactional
    public ApplicationDto updateApplicationStatus(Long id, String status) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        ApplicationStatus newStatus;
        try { newStatus = ApplicationStatus.valueOf(status.toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + status); }
        app.setStatus(newStatus);
        return applicationService.toDto(applicationRepository.save(app));
    }

    @Override
    @Transactional
    public void deleteApplication(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        applicationRepository.delete(app);
    }

    private UserDto toUserDto(User u) {
        return UserDto.builder().id(u.getId()).fullName(u.getFullName()).email(u.getEmail())
                .phone(u.getPhone()).role(u.getRole().name()).status(u.getStatus().name())
                .createdAt(u.getCreatedAt()).updatedAt(u.getUpdatedAt()).build();
    }

    private <T extends Enum<T>> T parseEnum(String value, Class<T> enumClass) {
        if (value == null || value.isBlank()) return null;
        try { return Enum.valueOf(enumClass, value.toUpperCase()); }
        catch (IllegalArgumentException e) { return null; }
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
