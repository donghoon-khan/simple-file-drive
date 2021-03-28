package com.donghoonkhan.httpfileserver.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.NotDirectoryException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.donghoonkhan.httpfileserver.model.FileResponse;
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
    public void moveFile(String src, String dst, Boolean overwrite) throws IOException {
        Path srcPath = Paths.get(src);
        Path dstPath = Paths.get(dst);

        if (overwrite.booleanValue()) {
            Files.move(srcPath, dstPath, StandardCopyOption.REPLACE_EXISTING);
        } else {
            Files.move(srcPath, dstPath);
        }
    }

    @Override
    public void storeFile(String directory, MultipartFile file) throws IOException {
        
        Path directoryPath = Paths.get(directory);
        if (!Files.isDirectory(directoryPath)) {
            throw new NotDirectoryException(directory);
        }
        
        Path filePath = Paths.get(directory + "/" + file.getOriginalFilename());
        byte[] bytes = file.getBytes();
        Files.write(filePath, bytes);
    }
}
