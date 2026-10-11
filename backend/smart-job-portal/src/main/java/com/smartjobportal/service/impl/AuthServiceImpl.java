package com.smartjobportal.service.impl;

import com.smartjobportal.dto.*;
import com.smartjobportal.exception.BadRequestException;
import com.smartjobportal.model.*;
import com.smartjobportal.repository.*;
import com.smartjobportal.service.AuthService;
import com.smartjobportal.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Allowed: JOB_SEEKER, RECRUITER");
        }
        if (role == Role.ADMIN) {
            throw new BadRequestException("Cannot register as ADMIN");
        }

        User user = userRepository.save(User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .status(UserStatus.ACTIVE)
                .build());

        if (role == Role.JOB_SEEKER) {
            jobSeekerProfileRepository.save(JobSeekerProfile.builder().user(user).build());
        } else {
            recruiterProfileRepository.save(RecruiterProfile.builder().user(user).build());
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());
        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new BadRequestException("Account is deactivated. Contact admin.");
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());
        return buildAuthResponse(token, user);
    }

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        return toUserDto(user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token).tokenType("Bearer")
                .id(user.getId()).fullName(user.getFullName())
                .email(user.getEmail()).role(user.getRole().name())
                .status(user.getStatus().name()).build();
    }

    private UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId()).fullName(user.getFullName())
                .email(user.getEmail()).phone(user.getPhone())
                .role(user.getRole().name()).status(user.getStatus().name())
                .createdAt(user.getCreatedAt()).updatedAt(user.getUpdatedAt()).build();
    }
}
