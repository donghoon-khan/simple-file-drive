package com.donghoonkhan.httpfileserver.service.impl;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;
import com.donghoonkhan.httpfileserver.service.DirectoryService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DirectoryServiceImpl implements DirectoryService {

    @Override
    public void createDirectory(String directory) throws IOException {
        if (Files.exists(Paths.get(directory))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Directory already exists");
        }
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
        
        Path path = Paths.get(directory);

        if (!Files.exists(path)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, directory + " does not exists.");
        } else if(!Files.isDirectory(path)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, directory + " does not directory.");
        }

        Files.walk(Paths.get(directory))
                .sorted(Comparator.reverseOrder())
                .map(Path::toFile)
                .forEach(File::delete);
    }
    
}
