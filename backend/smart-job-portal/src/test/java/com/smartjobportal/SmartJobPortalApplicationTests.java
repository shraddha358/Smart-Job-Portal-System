package com.smartjobportal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartjobportal.dto.LoginRequest;
import com.smartjobportal.dto.RegisterRequest;
import com.smartjobportal.model.*;
import com.smartjobportal.repository.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SmartJobPortalApplicationTests {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired UserRepository userRepository;
    @Autowired JobRepository jobRepository;
    @Autowired PasswordEncoder passwordEncoder;

    static String seekerToken;
    static String recruiterToken;

    @Test @Order(1)
    void registerJobSeeker() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Test Seeker");
        req.setEmail("testseeker@test.com");
        req.setPassword("Test@1234");
        req.setConfirmPassword("Test@1234");
        req.setPhone("9876543210");
        req.setRole("JOB_SEEKER");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.role").value("JOB_SEEKER"))
                .andReturn();

        seekerToken = objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    @Test @Order(2)
    void registerDuplicateEmail() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Test Seeker 2");
        req.setEmail("testseeker@test.com");
        req.setPassword("Test@1234");
        req.setConfirmPassword("Test@1234");
        req.setPhone("9876543211");
        req.setRole("JOB_SEEKER");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test @Order(3)
    void registerAdminRoleBlocked() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Fake Admin");
        req.setEmail("fakeadmin@test.com");
        req.setPassword("Test@1234");
        req.setConfirmPassword("Test@1234");
        req.setPhone("9876543212");
        req.setRole("ADMIN");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test @Order(4)
    void registerRecruiter() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Test Recruiter");
        req.setEmail("testrecruiter@test.com");
        req.setPassword("Test@1234");
        req.setConfirmPassword("Test@1234");
        req.setPhone("9876543213");
        req.setRole("RECRUITER");

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("RECRUITER"))
                .andReturn();

        recruiterToken = objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    @Test @Order(5)
    void loginSuccess() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("testseeker@test.com");
        req.setPassword("Test@1234");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test @Order(6)
    void loginInvalidCredentials() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("testseeker@test.com");
        req.setPassword("WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test @Order(7)
    void getPublicJobs() throws Exception {
        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test @Order(8)
    void protectedEndpointRequiresAuth() throws Exception {
        mockMvc.perform(get("/api/jobseeker/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test @Order(9)
    void jobSeekerCanAccessDashboard() throws Exception {
        mockMvc.perform(get("/api/jobseeker/dashboard")
                .header("Authorization", "Bearer " + seekerToken))
                .andExpect(status().isOk());
    }

    @Test @Order(10)
    void recruiterCannotAccessJobSeekerEndpoint() throws Exception {
        mockMvc.perform(get("/api/jobseeker/dashboard")
                .header("Authorization", "Bearer " + recruiterToken))
                .andExpect(status().isForbidden());
    }

    @Test @Order(11)
    void jobSeekerCannotAccessRecruiterEndpoint() throws Exception {
        mockMvc.perform(get("/api/recruiter/dashboard")
                .header("Authorization", "Bearer " + seekerToken))
                .andExpect(status().isForbidden());
    }

    @Test @Order(12)
    void getCurrentUser() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + seekerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("testseeker@test.com"));
    }
}
