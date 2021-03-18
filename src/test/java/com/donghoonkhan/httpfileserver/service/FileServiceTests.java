package com.donghoonkhan.httpfileserver.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

public class FileServiceTests {
    
    @TempDir
    Path directory;

    @Test
    void Test_GetAllFilesAndDirectories() throws IOException {
        
        Path file1 = directory.resolve("file1.test");
        Path file2 = directory.resolve("file2.test");
        Path directory1 = directory.resolve("directory1");
        Path directory2 = directory.resolve("directory2");

        Files.createFile(file1);
        Files.createFile(file2);
        Files.createDirectory(directory1);
        Files.createDirectory(directory2);

        FileService fileService = new FileServiceImpl();
        assertEquals(4, fileService.getAllFilesAndDirectories(directory).size());
        
    }
}
