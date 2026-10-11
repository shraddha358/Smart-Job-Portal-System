package com.smartjobportal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recruiter_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecruiterProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String companyDescription;

    private String companyWebsite;
    private String companyLocation;
    private String linkedinUrl;
}
