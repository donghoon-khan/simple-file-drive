package com.donghoonkhan.httpfileserver.service;

import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    
    public Resource getFileAsResource(String file) throws IOException;
    public void storeFile(String directory, MultipartFile file) throws IOException;
    public void moveFile(String src, String dst, Boolean overwrite) throws IOException;
}
