package com.smartjobportal.repository;

import com.smartjobportal.model.JobSeekerProfile;
import com.smartjobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobSeekerProfileRepository extends JpaRepository<JobSeekerProfile, Long> {
    Optional<JobSeekerProfile> findByUser(User user);
    Optional<JobSeekerProfile> findByUserId(Long userId);
}
