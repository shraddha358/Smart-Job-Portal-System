package com.smartjobportal.service;

import com.smartjobportal.dto.AuthResponse;
import com.smartjobportal.dto.LoginRequest;
import com.smartjobportal.dto.RegisterRequest;
import com.smartjobportal.dto.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDto getCurrentUser(String email);
}
