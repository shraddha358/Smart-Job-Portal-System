package com.smartjobportal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "job_seeker_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobSeekerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String address;
    private String city;
    private String state;
    private LocalDate dateOfBirth;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String education;

    @Column(columnDefinition = "TEXT")
    private String experience;

    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String resumeFileName;
    private String resumeStorageName;
}
