package com.donghoonkhan.httpfileserver.service;

import java.io.IOException;
import java.util.List;

import com.donghoonkhan.httpfileserver.model.FileObject;

public interface DirectoryService {
    
    public void createDirectory(String directory) throws IOException;
    public void deleteDirectory(String directory) throws IOException;
    public List<FileObject> getDirectory(String directory) throws IOException;
}
