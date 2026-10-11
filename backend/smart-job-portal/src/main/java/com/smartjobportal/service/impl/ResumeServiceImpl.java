package com.smartjobportal.service.impl;

import com.smartjobportal.exception.BadRequestException;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.model.JobSeekerProfile;
import com.smartjobportal.model.User;
import com.smartjobportal.repository.ApplicationRepository;
import com.smartjobportal.repository.JobSeekerProfileRepository;
import com.smartjobportal.repository.UserRepository;
import com.smartjobportal.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private static final List<String> ALLOWED_EXTENSIONS = List.of("pdf", "doc", "docx");
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    @Value("${app.upload.dir}")
    private String uploadDir;

    private final UserRepository userRepository;
    private final JobSeekerProfileRepository jobSeekerProfileRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    @Transactional
    public String uploadResume(String email, MultipartFile file) {
        validateFile(file);
        User user = getUser(email);
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        // Delete old resume if exists
        if (profile.getResumeStorageName() != null) {
            deleteFile(profile.getResumeStorageName());
        }

        String ext = getExtension(file.getOriginalFilename());
        String storageName = UUID.randomUUID() + "." + ext;
        saveFile(file, storageName);

        profile.setResumeStorageName(storageName);
        profile.setResumeFileName(file.getOriginalFilename());
        jobSeekerProfileRepository.save(profile);
        return file.getOriginalFilename();
    }

    @Override
    public Resource downloadResume(String email) {
        User user = getUser(email);
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        if (profile.getResumeStorageName() == null) {
            throw new ResourceNotFoundException("No resume uploaded");
        }
        return loadFile(profile.getResumeStorageName());
    }

    @Override
    public Resource downloadResumeByStorageName(String storageName, String requesterEmail) {
        // Prevent path traversal
        if (storageName.contains("..") || storageName.contains("/") || storageName.contains("\\")) {
            throw new BadRequestException("Invalid file reference");
        }
        return loadFile(storageName);
    }

    @Override
    @Transactional
    public void deleteResume(String email) {
        User user = getUser(email);
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        if (profile.getResumeStorageName() == null) {
            throw new ResourceNotFoundException("No resume to delete");
        }
        deleteFile(profile.getResumeStorageName());
        profile.setResumeStorageName(null);
        profile.setResumeFileName(null);
        jobSeekerProfileRepository.save(profile);
    }

    @Override
    public String getResumeFileName(String email) {
        User user = getUser(email);
        JobSeekerProfile profile = jobSeekerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return profile.getResumeFileName();
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BadRequestException("File is empty");
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException("Only PDF, DOC, DOCX files are allowed");
        }
        String ext = getExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(ext.toLowerCase())) {
            throw new BadRequestException("Only PDF, DOC, DOCX files are allowed");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    private void saveFile(MultipartFile file, String storageName) {
        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            Path target = dir.resolve(storageName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    private Resource loadFile(String storageName) {
        try {
            Path path = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(storageName);
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists()) throw new ResourceNotFoundException("File not found");
            return resource;
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("File not found");
        }
    }

    private void deleteFile(String storageName) {
        try {
            Path path = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(storageName);
            Files.deleteIfExists(path);
        } catch (IOException ignored) {}
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
