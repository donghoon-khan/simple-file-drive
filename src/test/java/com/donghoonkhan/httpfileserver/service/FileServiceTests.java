package com.donghoonkhan.httpfileserver.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;

import com.donghoonkhan.httpfileserver.service.impl.FileServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;

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
    void Test_LoadFileAsResource() throws Exception {

        Path file = directory.resolve("test.test");
        Files.createFile(file);

        FileService fileService = new FileServiceImpl();
        Resource resource = fileService.getFileAsResource(directory.toString() + "/test.test");
        assertEquals(file.toUri(), resource.getURI());

    }

    @Test
    void Test_MoveFile() throws Exception {
        Path file1 = directory.resolve("file1.test");
        Path file2 = directory.resolve("file2.test");
        Path directory1 = directory.resolve("directory1");
        Path directory2 = directory.resolve("directory2");

        Files.createFile(file1);
        Files.createFile(file2);
        Files.createDirectory(directory1);
        Files.createDirectory(directory2);

        FileService fileService = new FileServiceImpl();
        assertDoesNotThrow(() -> fileService.moveFile(directory.toString() + "/directory1", directory.toString() + "/test", false));
        assertThrows(FileAlreadyExistsException.class, () -> fileService.moveFile(directory.toString() + "/file1.test", directory.toString() + "/file2.test", false));
        assertDoesNotThrow(() -> fileService.moveFile(directory.toString() + "/file1.test", directory.toString() + "/file2.test", true));
    }
}
