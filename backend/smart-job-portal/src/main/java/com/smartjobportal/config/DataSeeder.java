package com.smartjobportal.config;

import com.smartjobportal.model.*;
import com.smartjobportal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping.");
            return;
        }
        log.info("Seeding database with sample data...");

        // Admin
        User admin = userRepository.save(User.builder()
                .fullName("Admin User").email("admin@smartjobportal.com")
                .password(passwordEncoder.encode("Admin@1234"))
                .phone("9000000000").role(Role.ADMIN).status(UserStatus.ACTIVE).build());

        // Recruiters
        User rec1 = userRepository.save(User.builder()
                .fullName("Rahul Sharma").email("rahul@techcorp.com")
                .password(passwordEncoder.encode("Recruiter@1234"))
                .phone("9111111111").role(Role.RECRUITER).status(UserStatus.ACTIVE).build());
        User rec2 = userRepository.save(User.builder()
                .fullName("Priya Patel").email("priya@infosys.com")
                .password(passwordEncoder.encode("Recruiter@1234"))
                .phone("9222222222").role(Role.RECRUITER).status(UserStatus.ACTIVE).build());

        recruiterProfileRepository.save(RecruiterProfile.builder().user(rec1)
                .companyName("TechCorp Solutions").companyDescription("Leading IT solutions provider")
                .companyWebsite("https://techcorp.com").companyLocation("Bangalore, India").build());
        recruiterProfileRepository.save(RecruiterProfile.builder().user(rec2)
                .companyName("Infosys Ltd").companyDescription("Global IT consulting company")
                .companyWebsite("https://infosys.com").companyLocation("Pune, India").build());

        // Job Seekers
        List<User> seekers = userRepository.saveAll(List.of(
            User.builder().fullName("Amit Kumar").email("amit@gmail.com")
                .password(passwordEncoder.encode("Seeker@1234")).phone("9333333333")
                .role(Role.JOB_SEEKER).status(UserStatus.ACTIVE).build(),
            User.builder().fullName("Sneha Joshi").email("sneha@gmail.com")
                .password(passwordEncoder.encode("Seeker@1234")).phone("9444444444")
                .role(Role.JOB_SEEKER).status(UserStatus.ACTIVE).build(),
            User.builder().fullName("Vikram Singh").email("vikram@gmail.com")
                .password(passwordEncoder.encode("Seeker@1234")).phone("9555555555")
                .role(Role.JOB_SEEKER).status(UserStatus.ACTIVE).build(),
            User.builder().fullName("Pooja Desai").email("pooja@gmail.com")
                .password(passwordEncoder.encode("Seeker@1234")).phone("9666666666")
                .role(Role.JOB_SEEKER).status(UserStatus.ACTIVE).build(),
            User.builder().fullName("Rohan Mehta").email("rohan@gmail.com")
                .password(passwordEncoder.encode("Seeker@1234")).phone("9777777777")
                .role(Role.JOB_SEEKER).status(UserStatus.ACTIVE).build()
        ));

        for (User s : seekers) {
            jobSeekerProfileRepository.save(JobSeekerProfile.builder().user(s)
                    .city("Mumbai").state("Maharashtra")
                    .skills("Java, Spring Boot, React, MySQL")
                    .education("B.E. Computer Science, 2024")
                    .experience("0-1 years").build());
        }

        // Jobs
        List<Job> jobs = jobRepository.saveAll(List.of(
            Job.builder().recruiter(rec1).title("Java Backend Developer").companyName("TechCorp Solutions")
                .location("Bangalore").jobType(JobType.FULL_TIME).salary("4-6 LPA")
                .experienceRequired("0-2 years").skills("Java, Spring Boot, MySQL")
                .description("We are looking for a Java Backend Developer to join our team.")
                .responsibilities("Develop REST APIs, write unit tests, collaborate with frontend team.")
                .qualifications("B.E./B.Tech in CS or IT").applicationDeadline(LocalDate.now().plusDays(30))
                .status(JobStatus.ACTIVE).build(),
            Job.builder().recruiter(rec1).title("React Frontend Developer").companyName("TechCorp Solutions")
                .location("Bangalore").jobType(JobType.FULL_TIME).salary("3-5 LPA")
                .experienceRequired("0-1 years").skills("React, JavaScript, HTML, CSS")
                .description("Looking for a React developer to build modern web applications.")
                .responsibilities("Build UI components, integrate APIs, ensure responsiveness.")
                .qualifications("B.E./B.Tech in CS or IT").applicationDeadline(LocalDate.now().plusDays(25))
                .status(JobStatus.ACTIVE).build(),
            Job.builder().recruiter(rec1).title("Full Stack Developer").companyName("TechCorp Solutions")
                .location("Remote").jobType(JobType.REMOTE).salary("5-8 LPA")
                .experienceRequired("1-3 years").skills("Java, React, MySQL, Docker")
                .description("Full stack developer for our product team.")
                .responsibilities("End-to-end feature development, code reviews.")
                .qualifications("B.E./B.Tech").applicationDeadline(LocalDate.now().plusDays(20))
                .status(JobStatus.ACTIVE).build(),
            Job.builder().recruiter(rec2).title("Software Engineer Trainee").companyName("Infosys Ltd")
                .location("Pune").jobType(JobType.FULL_TIME).salary("3.6 LPA")
                .experienceRequired("Fresher").skills("Java, Python, SQL")
                .description("Infosys is hiring fresh graduates for its training program.")
                .responsibilities("Learn and implement software solutions under guidance.")
                .qualifications("B.E./B.Tech with 60% aggregate").applicationDeadline(LocalDate.now().plusDays(45))
                .status(JobStatus.ACTIVE).build(),
            Job.builder().recruiter(rec2).title("Data Analyst Intern").companyName("Infosys Ltd")
                .location("Hyderabad").jobType(JobType.INTERNSHIP).salary("15000/month")
                .experienceRequired("Fresher").skills("Python, SQL, Excel, Power BI")
                .description("6-month internship in data analytics team.")
                .responsibilities("Analyze data, create reports, support senior analysts.")
                .qualifications("B.E./B.Tech or BCA final year").applicationDeadline(LocalDate.now().plusDays(15))
                .status(JobStatus.ACTIVE).build(),
            Job.builder().recruiter(rec2).title("DevOps Engineer").companyName("Infosys Ltd")
                .location("Chennai").jobType(JobType.FULL_TIME).salary("6-9 LPA")
                .experienceRequired("1-2 years").skills("Docker, Kubernetes, Jenkins, AWS")
                .description("DevOps engineer to manage CI/CD pipelines.")
                .responsibilities("Maintain infrastructure, automate deployments.")
                .qualifications("B.E./B.Tech").applicationDeadline(LocalDate.now().plusDays(30))
                .status(JobStatus.ACTIVE).build(),
            Job.builder().recruiter(rec1).title("Android Developer").companyName("TechCorp Solutions")
                .location("Bangalore").jobType(JobType.FULL_TIME).salary("4-7 LPA")
                .experienceRequired("0-2 years").skills("Android, Kotlin, Java, REST APIs")
                .description("Android developer for mobile product team.")
                .responsibilities("Develop and maintain Android applications.")
                .qualifications("B.E./B.Tech in CS or IT").applicationDeadline(LocalDate.now().plusDays(20))
                .status(JobStatus.ACTIVE).build(),
            Job.builder().recruiter(rec1).title("QA Engineer").companyName("TechCorp Solutions")
                .location("Bangalore").jobType(JobType.FULL_TIME).salary("3-5 LPA")
                .experienceRequired("0-1 years").skills("Selenium, Java, TestNG, JIRA")
                .description("QA engineer to ensure software quality.")
                .responsibilities("Write test cases, perform manual and automated testing.")
                .qualifications("B.E./B.Tech").applicationDeadline(LocalDate.now().plusDays(18))
                .status(JobStatus.ACTIVE).build(),
            Job.builder().recruiter(rec2).title("Business Analyst").companyName("Infosys Ltd")
                .location("Mumbai").jobType(JobType.FULL_TIME).salary("5-7 LPA")
                .experienceRequired("0-2 years").skills("SQL, Excel, Communication, Agile")
                .description("Business analyst to bridge business and technology.")
                .responsibilities("Gather requirements, create BRDs, coordinate with stakeholders.")
                .qualifications("B.E./B.Tech or MBA").applicationDeadline(LocalDate.now().plusDays(22))
                .status(JobStatus.ACTIVE).build(),
            Job.builder().recruiter(rec2).title("Cloud Engineer").companyName("Infosys Ltd")
                .location("Bangalore").jobType(JobType.FULL_TIME).salary("7-10 LPA")
                .experienceRequired("1-3 years").skills("AWS, Azure, Terraform, Linux")
                .description("Cloud engineer to manage cloud infrastructure.")
                .responsibilities("Design and implement cloud solutions.")
                .qualifications("B.E./B.Tech with cloud certifications preferred").applicationDeadline(LocalDate.now().plusDays(35))
                .status(JobStatus.ACTIVE).build()
        ));

        // Applications
        applicationRepository.save(Application.builder().job(jobs.get(0)).applicant(seekers.get(0))
                .status(ApplicationStatus.UNDER_REVIEW).build());
        applicationRepository.save(Application.builder().job(jobs.get(1)).applicant(seekers.get(0))
                .status(ApplicationStatus.APPLIED).build());
        applicationRepository.save(Application.builder().job(jobs.get(3)).applicant(seekers.get(1))
                .status(ApplicationStatus.SHORTLISTED).build());
        applicationRepository.save(Application.builder().job(jobs.get(4)).applicant(seekers.get(1))
                .status(ApplicationStatus.APPLIED).build());
        applicationRepository.save(Application.builder().job(jobs.get(0)).applicant(seekers.get(2))
                .status(ApplicationStatus.INTERVIEW).build());
        applicationRepository.save(Application.builder().job(jobs.get(5)).applicant(seekers.get(2))
                .status(ApplicationStatus.APPLIED).build());
        applicationRepository.save(Application.builder().job(jobs.get(2)).applicant(seekers.get(3))
                .status(ApplicationStatus.SELECTED).build());
        applicationRepository.save(Application.builder().job(jobs.get(6)).applicant(seekers.get(3))
                .status(ApplicationStatus.APPLIED).build());
        applicationRepository.save(Application.builder().job(jobs.get(8)).applicant(seekers.get(4))
                .status(ApplicationStatus.REJECTED).build());
        applicationRepository.save(Application.builder().job(jobs.get(9)).applicant(seekers.get(4))
                .status(ApplicationStatus.APPLIED).build());

        // Saved Jobs
        savedJobRepository.save(SavedJob.builder().user(seekers.get(0)).job(jobs.get(2)).build());
        savedJobRepository.save(SavedJob.builder().user(seekers.get(0)).job(jobs.get(3)).build());
        savedJobRepository.save(SavedJob.builder().user(seekers.get(1)).job(jobs.get(0)).build());
        savedJobRepository.save(SavedJob.builder().user(seekers.get(2)).job(jobs.get(7)).build());

        log.info("Database seeding complete.");
        log.info("=== DEV CREDENTIALS (TEST ONLY) ===");
        log.info("Admin:     admin@smartjobportal.com / Admin@1234");
        log.info("Recruiter: rahul@techcorp.com / Recruiter@1234");
        log.info("Recruiter: priya@infosys.com / Recruiter@1234");
        log.info("Seeker:    amit@gmail.com / Seeker@1234");
        log.info("====================================");
    }
}
