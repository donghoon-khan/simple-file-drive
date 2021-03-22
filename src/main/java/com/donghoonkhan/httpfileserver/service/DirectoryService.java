package com.donghoonkhan.httpfileserver.service;

import java.io.IOException;
import java.util.List;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;

public interface DirectoryService {
    
    public void createDirectory(String directory) throws IOException;
    public void deleteDirectory(String directory) throws IOException;
    public List<DirectoryResponse> getListDirectories(String directory) throws IOException;
}
