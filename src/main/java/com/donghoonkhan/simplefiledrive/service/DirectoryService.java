package com.donghoonkhan.simplefiledrive.service;

import java.io.IOException;
import java.util.List;

import com.donghoonkhan.simplefiledrive.model.FileObject;

public interface DirectoryService {
    
    public List<FileObject> getDirectory(String directory) throws IOException;
    public void createDirectory(String directory) throws IOException;
    public void moveDirectory(String source, String target, Boolean force) throws IOException;
    public void deleteDirectory(String directory) throws IOException;
}
