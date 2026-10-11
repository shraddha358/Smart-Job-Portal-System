package com.smartjobportal.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {
    String uploadResume(String email, MultipartFile file);
    Resource downloadResume(String email);
    Resource downloadResumeByStorageName(String storageName, String requesterEmail);
    void deleteResume(String email);
    String getResumeFileName(String email);
}
