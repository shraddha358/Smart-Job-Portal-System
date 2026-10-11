package com.smartjobportal.service.impl;

import com.smartjobportal.dto.*;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.model.*;
import com.smartjobportal.repository.*;
import com.smartjobportal.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;

    @Override
    public JobSeekerProfileDto getJobSeekerProfile(String email) {
        User user = getUser(email);
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return toJobSeekerDto(profile, user);
    }

    @Override
    @Transactional
    public JobSeekerProfileDto updateJobSeekerProfile(String email, JobSeekerProfileUpdateRequest request) {
        User user = getUser(email);
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser(user)
                .orElseGet(() -> JobSeekerProfile.builder().user(user).build());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setSkills(request.getSkills());
        profile.setEducation(request.getEducation());
        profile.setExperience(request.getExperience());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);
        return toJobSeekerDto(jobSeekerProfileRepository.save(profile), user);
    }

    @Override
    public RecruiterProfileDto getRecruiterProfile(String email) {
        User user = getUser(email);
        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return toRecruiterDto(profile, user);
    }

    @Override
    @Transactional
    public RecruiterProfileDto updateRecruiterProfile(String email, RecruiterProfileUpdateRequest request) {
        User user = getUser(email);
        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseGet(() -> RecruiterProfile.builder().user(user).build());
        profile.setCompanyName(request.getCompanyName());
        profile.setCompanyDescription(request.getCompanyDescription());
        profile.setCompanyWebsite(request.getCompanyWebsite());
        profile.setCompanyLocation(request.getCompanyLocation());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);
        return toRecruiterDto(recruiterProfileRepository.save(profile), user);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private JobSeekerProfileDto toJobSeekerDto(JobSeekerProfile p, User u) {
        return JobSeekerProfileDto.builder()
                .id(p.getId()).userId(u.getId()).fullName(u.getFullName())
                .email(u.getEmail()).phone(u.getPhone())
                .address(p.getAddress()).city(p.getCity()).state(p.getState())
                .dateOfBirth(p.getDateOfBirth()).skills(p.getSkills())
                .education(p.getEducation()).experience(p.getExperience())
                .linkedinUrl(p.getLinkedinUrl()).githubUrl(p.getGithubUrl())
                .portfolioUrl(p.getPortfolioUrl()).resumeFileName(p.getResumeFileName())
                .hasResume(p.getResumeStorageName() != null).build();
    }

    private RecruiterProfileDto toRecruiterDto(RecruiterProfile p, User u) {
        return RecruiterProfileDto.builder()
                .id(p.getId()).userId(u.getId()).fullName(u.getFullName())
                .email(u.getEmail()).phone(u.getPhone())
                .companyName(p.getCompanyName()).companyDescription(p.getCompanyDescription())
                .companyWebsite(p.getCompanyWebsite()).companyLocation(p.getCompanyLocation())
                .linkedinUrl(p.getLinkedinUrl()).build();
    }
}
