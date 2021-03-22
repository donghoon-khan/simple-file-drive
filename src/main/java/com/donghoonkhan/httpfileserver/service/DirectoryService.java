package com.donghoonkhan.httpfileserver.service;

import java.io.IOException;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;

public interface DirectoryService {
    
    public void createDirectory(String path, String directoryName);
    public DirectoryResponse getDirectory(String directory) throws IOException;
}
