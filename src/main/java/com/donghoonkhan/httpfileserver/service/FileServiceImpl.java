package com.donghoonkhan.httpfileserver.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.model.FileType;

import org.springframework.stereotype.Service;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public List<FileObject> getAllFilesAndDirectories(Path path) throws IOException {
        try (Stream<Path> stream =  Files.list(path)) {

            return stream
                    .sorted((p1, p2) -> Boolean.valueOf(Files.isDirectory(p2)).compareTo(Boolean.valueOf(Files.isDirectory(p1))))
                    .map(file -> FileObject.builder()
                            .type(Files.isDirectory(file) ? FileType.DIRECTORY : FileType.FILE)
                            .name(file.getFileName().toString())
                            .path(file.toString())
                            .build()
                    )
                    .collect(Collectors.toList());
        }
    }
    
}
