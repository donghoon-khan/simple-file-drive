package com.donghoonkhan.httpfileserver.service;

import java.io.IOException;
import java.util.List;

import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.model.FileResponse;

import org.springframework.core.io.Resource;

public interface FileService {
    
    public List<FileObject> getAllFilesAndDirectories(String path) throws IOException;
    public Resource loadFileAsResource(String fileName);
    public List<FileResponse> getAllFilesAsFileResponse(String directory) throws IOException;
}
