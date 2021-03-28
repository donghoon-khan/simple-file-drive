package com.donghoonkhan.httpfileserver.service.impl;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.DirectoryStream;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;
import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.service.DirectoryService;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DirectoryServiceImpl implements DirectoryService {

    @Override
    public void createDirectory(String directory) throws IOException {
        Path path = Paths.get(directory);
        Files.createDirectory(path);
    }

    @Override
    public List<DirectoryResponse> getListDirectories(String directory) throws IOException {

        Path path = Paths.get(directory);
        try (Stream<Path> stream =  Files.list(path)) {

            return stream.filter(entity -> Boolean.valueOf(Files.isDirectory(entity)))
                    .map(file -> {
                        try {
                            return DirectoryResponse.builder()
                                    .name(file.getFileName().toString())
                                    .path(file.toString())
                                    .size(Files.size(file))
                                    .createdAt(Files.readAttributes(file, BasicFileAttributes.class).creationTime().toInstant())
                                    .modifiedAt(Files.readAttributes(file, BasicFileAttributes.class).lastModifiedTime().toInstant())
                                    .build();
                        } catch (IOException e) {
                            throw new UncheckedIOException(e);
                        }
            }).collect(Collectors.toList());
        }
    }

    @Override
    public void deleteDirectory(String directory) throws IOException {

        Files.walk(Paths.get(directory))
                .sorted(Comparator.reverseOrder())
                .map(Path::toFile)
                .forEach(File::delete);
    }

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
}
