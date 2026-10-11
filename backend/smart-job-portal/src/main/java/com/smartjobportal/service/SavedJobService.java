package com.smartjobportal.service;

import com.smartjobportal.dto.SavedJobDto;

import java.util.List;

public interface SavedJobService {
    SavedJobDto saveJob(Long jobId, String userEmail);
    void unsaveJob(Long jobId, String userEmail);
    List<SavedJobDto> getSavedJobs(String userEmail);
}
