package com.smartjobportal.repository;

import com.smartjobportal.model.Job;
import com.smartjobportal.model.JobStatus;
import com.smartjobportal.model.JobType;
import com.smartjobportal.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByRecruiter(User recruiter, Pageable pageable);
    List<Job> findByRecruiter(User recruiter);
    long countByRecruiter(User recruiter);
    long countByRecruiterAndStatus(User recruiter, JobStatus status);
    long countByStatus(JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%',:keyword,'%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%',:keyword,'%'))) AND " +
           "(:company IS NULL OR LOWER(j.companyName) LIKE LOWER(CONCAT('%',:company,'%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%',:location,'%'))) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:experience IS NULL OR LOWER(j.experienceRequired) LIKE LOWER(CONCAT('%',:experience,'%')))")
    Page<Job> findActiveJobsWithFilters(@Param("keyword") String keyword,
                                        @Param("company") String company,
                                        @Param("location") String location,
                                        @Param("jobType") JobType jobType,
                                        @Param("experience") String experience,
                                        Pageable pageable);

    @Query("SELECT j FROM Job j WHERE " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%',:keyword,'%'))) AND " +
           "(:status IS NULL OR j.status = :status)")
    Page<Job> findAdminJobsWithFilters(@Param("keyword") String keyword,
                                       @Param("status") JobStatus status,
                                       Pageable pageable);

    List<Job> findTop5ByStatusOrderByCreatedAtDesc(JobStatus status);
}
