package com.donghoonkhan.httpfileserver.service;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

import com.donghoonkhan.httpfileserver.model.FileObject;

public interface FileService {
    
    public List<FileObject> getAllFilesAndDirectories(Path path) throws IOException;
}
