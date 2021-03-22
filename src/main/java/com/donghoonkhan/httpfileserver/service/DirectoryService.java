package com.donghoonkhan.httpfileserver.service;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;

import org.springframework.web.server.ResponseStatusException;

public interface DirectoryService {
    
    public void createDirectory(String path, String directoryName);
    public DirectoryResponse getDirectory(String path) throws ResponseStatusException;
}
