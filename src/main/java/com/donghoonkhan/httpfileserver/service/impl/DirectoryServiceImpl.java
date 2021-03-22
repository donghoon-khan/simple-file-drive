package com.donghoonkhan.httpfileserver.service.impl;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.stream.Stream;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;
import com.donghoonkhan.httpfileserver.service.DirectoryService;
import com.donghoonkhan.httpfileserver.service.FileService;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DirectoryServiceImpl implements DirectoryService {

    private final FileService fileService;

    @Override
    public void createDirectory(String path, String directoryName) {
    }

    @Override
    public DirectoryResponse getDirectory(String directory) throws IOException {

        DirectoryResponse directoryResponse = new DirectoryResponse();
        Path path = Paths.get(directory);
        try (Stream<Path> stream =  Files.list(path)) {
            stream.filter(entity -> Boolean.valueOf(Files.isDirectory(entity)))
                    .forEach(subDir -> {
                        try {
                            directoryResponse.getSubDirectories().add(getDirectory(subDir.toString()));
                        } catch (IOException e) {
                            throw new UncheckedIOException(e);
                        }
                    });
            directoryResponse.setCreatedAt(Files.readAttributes(path, BasicFileAttributes.class).creationTime().toInstant());
            directoryResponse.setModifiedAt(Files.readAttributes(path, BasicFileAttributes.class).lastModifiedTime().toInstant());
            directoryResponse.setSize(Files.size(path));
            directoryResponse.setFiles(fileService.getListFiles(directory));
            directoryResponse.setPath(path.toString());
            return directoryResponse;
        }
    }
    
}
