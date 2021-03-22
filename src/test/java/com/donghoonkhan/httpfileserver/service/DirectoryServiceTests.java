package com.donghoonkhan.httpfileserver.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import com.donghoonkhan.httpfileserver.service.impl.DirectoryServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class DirectoryServiceTests {
    
    @TempDir
    Path directory;

    DirectoryService directoryService;

    @BeforeEach
    void setup() throws IOException {
        directoryService = new DirectoryServiceImpl();
        Path file1 = directory.resolve("file1.test");
        Path file2 = directory.resolve("file2.test");
        Path directory1 = directory.resolve("directory1");
        Path directory2 = directory.resolve("directory2");

        Files.createFile(file1);
        Files.createFile(file2);
        Files.createDirectory(directory1);
        Files.createDirectory(directory2);
    }

    @Test
    void Test_GetDirectory() throws IOException {
        assertEquals(2, directoryService.getListDirectories(directory.toString()).size());
    }

    @Test
    void Test_CreateDirectory() throws IOException {
        final String NEW_DIRECTORY = directory.toString() + "/new";
        assertDoesNotThrow(() -> directoryService.createDirectory(NEW_DIRECTORY));
        try {
            directoryService.createDirectory(NEW_DIRECTORY);
        } catch(ResponseStatusException e) {
            assertEquals(HttpStatus.BAD_REQUEST, e.getStatus());
        }
    }

    @Test
    void Test_DeleteDirectory() throws IOException {
        final String DELETE_DIRECTORY = directory.toString() + "/directory1";
        assertDoesNotThrow(() -> directoryService.deleteDirectory(DELETE_DIRECTORY));
        try {
            directoryService.deleteDirectory(DELETE_DIRECTORY);
        } catch(ResponseStatusException e) {
            assertEquals(HttpStatus.BAD_REQUEST, e.getStatus());
        }
    }
}
