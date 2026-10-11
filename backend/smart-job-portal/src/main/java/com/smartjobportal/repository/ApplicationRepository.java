package com.smartjobportal.repository;

import com.smartjobportal.model.Application;
import com.smartjobportal.model.ApplicationStatus;
import com.smartjobportal.model.Job;
import com.smartjobportal.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicant(User applicant);
    Page<Application> findByApplicant(User applicant, Pageable pageable);
    boolean existsByJobAndApplicant(Job job, User applicant);
    Optional<Application> findByJobAndApplicant(Job job, User applicant);

    List<Application> findByJob(Job job);
    Page<Application> findByJob(Job job, Pageable pageable);

    long countByApplicant(User applicant);
    long countByApplicantAndStatus(User applicant, ApplicationStatus status);
    long countByJobRecruiter(User recruiter);
    long countByJobRecruiterAndStatus(User recruiter, ApplicationStatus status);
    long countByStatus(ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter = :recruiter ORDER BY a.appliedAt DESC")
    List<Application> findRecentByRecruiter(@Param("recruiter") User recruiter, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE " +
           "(:status IS NULL OR a.status = :status)")
    Page<Application> findAdminApplications(@Param("status") ApplicationStatus status, Pageable pageable);
}
