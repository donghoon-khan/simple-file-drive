package com.donghoonkhan.simplefiledrive.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;

import com.donghoonkhan.simplefiledrive.service.FileService;
import com.donghoonkhan.simplefiledrive.service.impl.FileServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public class FileServiceTests {
    
    @TempDir
    Path directory;

    @Test
    void Test_GetFileAsResource() throws IOException {
        Path file = directory.resolve("test");
        Files.createFile(file);

        FileService fileService = new FileServiceImpl();
        Resource resource = fileService.getFileAsResource(directory.toString() + "/test");
        assertEquals(file.toUri(), resource.getURI());

        assertThrows(FileNotFoundException.class, 
                () -> fileService.getFileAsResource(directory.toString()));
        assertThrows(FileNotFoundException.class, 
                () -> fileService.getFileAsResource(directory.toString() + "/null"));
    }

    @Test
    void Test_MoveFile() throws IOException {
        Path srcFile = directory.resolve("src");
        Path testFile = directory.resolve("testFile");
        Path testDir = directory.resolve("dir");
        Files.createFile(srcFile);
        Files.createFile(testFile);
        Files.createDirectory(testDir);

        FileService fileService = new FileServiceImpl();
        assertThrows(FileNotFoundException.class,
                () -> fileService.moveFile(directory.toString() + "/target", "/src", false));
        assertThrows(FileAlreadyExistsException.class,
                () -> fileService.moveFile(directory.toString() + "/src", directory.toString() + "/testFile", false));
        assertThrows(FileSystemNotFoundException.class, 
                () -> fileService.moveFile(directory.toString() + "/src", directory.toString() + "/nullDir/src", false));
        assertDoesNotThrow(() -> fileService.moveFile(directory.toString() + "/src", directory.toString() + "/dir/test", false));
    }
}
