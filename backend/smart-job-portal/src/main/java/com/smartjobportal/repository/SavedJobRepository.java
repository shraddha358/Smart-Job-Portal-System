package com.smartjobportal.repository;

import com.smartjobportal.model.Job;
import com.smartjobportal.model.SavedJob;
import com.smartjobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUser(User user);
    Optional<SavedJob> findByUserAndJob(User user, Job job);
    boolean existsByUserAndJob(User user, Job job);
    long countByUser(User user);
    void deleteByUserAndJob(User user, Job job);
}
