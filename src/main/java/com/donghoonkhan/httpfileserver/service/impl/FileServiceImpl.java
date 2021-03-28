package com.donghoonkhan.httpfileserver.service.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import com.donghoonkhan.httpfileserver.service.FileService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public Resource getFileAsResource(String file) throws IOException {
        Path path = Paths.get(file);

        if(!Files.isRegularFile(path)) {
            throw new FileNotFoundException(file);
        }
        return new UrlResource(path.toUri());
    }

    @Override
    public void moveFile(String source, String target, Boolean force) throws IOException {
        Path srcPath = Paths.get(source);
        Path targetPath = Paths.get(target);
        if (!Files.isRegularFile(srcPath)) {
            throw new FileNotFoundException(source);
        } else if(!Files.isDirectory(targetPath.getParent())) {
            throw new FileSystemNotFoundException(targetPath.getParent().toString());
        } else if(!force.booleanValue() && Files.exists(targetPath)) {
            throw new FileAlreadyExistsException(target);
        }

        if (force.booleanValue()) {
            Files.move(srcPath, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }
        Files.move(srcPath, targetPath);
    }

    @Override
    public void storeFile(String directory, MultipartFile file, Boolean force) throws IOException {
        Path directoryPath = Paths.get(directory);
        String dstFilePath = directory + "/" + file.getOriginalFilename();
        if (!Files.isDirectory(directoryPath)) {
            throw new FileSystemNotFoundException(directory);
        } else if(!force.booleanValue() && Files.exists(Paths.get(dstFilePath))) {
            throw new FileAlreadyExistsException(dstFilePath);
        }
        
        File dstFile = new File(dstFilePath);
        file.transferTo(dstFile);
    }
}
