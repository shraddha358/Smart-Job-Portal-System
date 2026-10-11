package com.smartjobportal.repository;

import com.smartjobportal.model.RecruiterProfile;
import com.smartjobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    Optional<RecruiterProfile> findByUser(User user);
    Optional<RecruiterProfile> findByUserId(Long userId);
}
