package com.donghoonkhan.simplefiledrive.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.nio.file.FileSystemAlreadyExistsException;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;

import com.donghoonkhan.simplefiledrive.service.DirectoryService;
import com.donghoonkhan.simplefiledrive.service.impl.DirectoryServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

public class DirectoryServiceTests {
    
    @TempDir
    Path directory;

    @Test
    void Test_GetDirectory() throws IOException {
        DirectoryService directoryService = new DirectoryServiceImpl();
        Path file1 = directory.resolve("file1.test");
        Path file2 = directory.resolve("file2.test");
        Path directory1 = directory.resolve("directory1");
        Path directory2 = directory.resolve("directory2");

        Files.createFile(file1);
        Files.createFile(file2);
        Files.createDirectory(directory1);
        Files.createDirectory(directory2);
        assertEquals(4, directoryService.getDirectory(directory.toString()).size());
    }

    @Test
    void Test_CreateDirectory() throws IOException {
        DirectoryService directoryService = new DirectoryServiceImpl();

        assertDoesNotThrow(() -> directoryService.createDirectory(directory.toString() + "/test"));
        assertThrows(FileSystemAlreadyExistsException.class, 
                () -> directoryService.createDirectory(directory.toString() + "/test"));
    }

    @Test
    void Test_MoveDirectory() throws IOException {
        DirectoryService directoryService = new DirectoryServiceImpl();

        Path srcDir = directory.resolve("src");
        Path testDir = directory.resolve("test");
        Files.createDirectory(srcDir);
        Files.createDirectory(testDir);

        assertThrows(FileSystemNotFoundException.class,
                () -> directoryService.moveDirectory(directory.toString() + "/target", "/src", false));
        assertThrows(FileSystemAlreadyExistsException.class, 
                () -> directoryService.moveDirectory(directory.toString() + "/src", directory.toString() + "/test", false));
        assertDoesNotThrow(() -> directoryService.moveDirectory(directory.toString() + "/src",
                directory.toString() + "/target", false));
        assertDoesNotThrow(() -> directoryService.moveDirectory(directory.toString() + "/test",
                directory.toString() + "/target", true));
    }

    @Test
    void Test_DeleteDirectory() throws IOException {
        DirectoryService directoryService = new DirectoryServiceImpl();

        Path testDir = directory.resolve("test");
        Files.createDirectory(testDir);

        assertDoesNotThrow(() -> directoryService.deleteDirectory(directory.toString() + "/test"));
        assertThrows(FileSystemNotFoundException.class,
                () -> directoryService.deleteDirectory(directory.toString() + "/test"));
    }
}
