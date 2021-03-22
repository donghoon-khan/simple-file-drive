package com.donghoonkhan.httpfileserver.service.impl;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.model.FileResponse;
import com.donghoonkhan.httpfileserver.model.FileType;
import com.donghoonkhan.httpfileserver.service.FileService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FileServiceImpl implements FileService {

    @Override
    public List<FileObject> getAllFilesAndDirectories(String path) throws IOException {
        try (Stream<Path> stream =  Files.list(Paths.get(path))) {

            return stream
                    .sorted((p1, p2) -> Boolean.valueOf(Files.isDirectory(p2)).compareTo(Boolean.valueOf(Files.isDirectory(p1))))
                    .map(file -> {
                        try {
                            return FileObject.builder()
                                        .type(Files.isDirectory(file) ? FileType.DIRECTORY : FileType.FILE)
                                        .name(file.getFileName().toString())
                                        .path(file.toString())
                                        .mimeType(Files.probeContentType(file))
                                    .build();
                        } catch (IOException e) {
                            return null;
                        }
                    })
                    .collect(Collectors.toList());
        }
    }

    @Override
    public Resource loadFileAsResource(String fileName) {
        Path filePath = Paths.get(fileName);
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (!Files.isDirectory(filePath) && resource.exists()) {
                return resource;
            } else {
                
                log.error("isDirectory:{}", Boolean.valueOf(Files.isDirectory(filePath)));
                log.error("is not exists:{}", resource.exists());
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        } catch (MalformedURLException e) {
            log.error(e.getMessage());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public List<FileResponse> getAllFilesAsFileResponse(String directory) throws IOException {
        try (Stream<Path> stream =  Files.list(Paths.get(directory))) {
            return stream
                    .filter(file -> !Boolean.valueOf(Files.isDirectory(file)))
                    .map(file -> {
                        try {
                            return FileResponse.builder()
                                    .mimeType(Files.probeContentType(Paths.get(file.toUri())))
                                    .name(file.getFileName().toString())
                                    .uri(file.toUri())
                                    .createdAt(Files.readAttributes(file, BasicFileAttributes.class).creationTime().toInstant())
                                    .modifiedAt(Files.readAttributes(file, BasicFileAttributes.class).lastModifiedTime().toInstant())
                                .build();
                        } catch (IOException e) {
                            throw new UncheckedIOException(e);
                        }
                    })
                    .collect(Collectors.toList());
        }
    } 
}
