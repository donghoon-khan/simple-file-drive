package com.donghoonkhan.simplefiledrive.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.FileSystemAlreadyExistsException;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import com.donghoonkhan.simplefiledrive.model.FileObject;
import com.donghoonkhan.simplefiledrive.service.DirectoryService;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DirectoryServiceImpl implements DirectoryService {

    @Override
    public List<FileObject> getDirectory(String directory) throws IOException {
        Path path = Paths.get(directory);
        if (!Files.isDirectory(path)) {
            throw new FileSystemNotFoundException(directory);
        }

        List<FileObject> fileObjects = new ArrayList<>();
        DirectoryStream<Path> stream = Files.newDirectoryStream(path);
        
        for (Path file : stream) {
            FileObject fileObject = new FileObject();
            if (Files.isDirectory(file)) {
                fileObject.setType("directory");
            } else {
                fileObject.setType(Files.probeContentType(file));
            }
            fileObject.setName(file.getFileName().toString());
            fileObject.setPath(file.toString());
            fileObject.setCreatedAt(Files.readAttributes(file, BasicFileAttributes.class).creationTime().toInstant());
            fileObject.setModifiedAt(Files.readAttributes(file, BasicFileAttributes.class).lastModifiedTime().toInstant());
            fileObject.setSize(Files.size(file));
            fileObjects.add(fileObject);
        }
        return fileObjects;        
    }

    @Override
    public void createDirectory(String directory) throws IOException {
        Path path = Paths.get(directory);
        if(Files.exists(path)) {
            throw new FileSystemAlreadyExistsException(directory);
        }

        Files.createDirectory(path);
    }

    @Override
    public void moveDirectory(String source, String target, Boolean force) throws IOException {
        Path srcPath = Paths.get(source);
        Path targetPath = Paths.get(target);
        if (!Files.isDirectory(srcPath)) {
            throw new FileSystemNotFoundException(source);
        } else if (!force.booleanValue() && Files.exists(targetPath)) {
            throw new FileSystemAlreadyExistsException(target);
        }

        if (force.booleanValue()) {
            Files.move(srcPath, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } else {
            Files.move(srcPath, targetPath);
        }
    }

    @Override
    public void deleteDirectory(String directory) throws IOException {
        Path path = Paths.get(directory);
        if (!Files.isDirectory(path)) {
            throw new FileSystemNotFoundException(directory);
        }

        Files.walk(Paths.get(directory))
                .sorted(Comparator.reverseOrder())
                .map(Path::toFile)
                .forEach(File::delete);
    }
}
