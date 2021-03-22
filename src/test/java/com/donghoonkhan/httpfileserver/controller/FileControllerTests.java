package com.donghoonkhan.httpfileserver.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.donghoonkhan.httpfileserver.AbstractIntegrationTest;
import com.donghoonkhan.httpfileserver.model.FileResponse;
import com.donghoonkhan.httpfileserver.service.FileService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class FileControllerTests extends AbstractIntegrationTest {
    
    @MockBean
    private FileService fileService;

    @TempDir
    Path path;

    private FileController fileController;

    @BeforeEach
    void setup() {
        fileController = new FileController(fileService, path.toString());
    }

    @Test
    void Test_GetAllFileAsFileResponse() throws Exception {
        List<FileResponse> files = new ArrayList<>();
        FileResponse fileResponse = FileResponse.builder()
            .createdAt(Instant.now())
            .modifiedAt(Instant.now())
            .name("test")
            .size(1L)
            .path(path.toString())
            .build();

        files.add(fileResponse);
        String expected = mapToJson(files);
        
        Mockito.when(fileService.getListFiles(path.toString())).thenReturn(files);
        ResponseEntity<List<FileResponse>> response = fileController.getAllFiles(path.toString());

        assertEquals(expected, mapToJson(response.getBody()));
        assertEquals(HttpStatus.OK,response.getStatusCode());
    }

    @Test
    void Test_DownloadFile() throws Exception {
        Resource resource = new UrlResource(path.toUri());
        Mockito.when(fileService.getFileAsResource(path.toString())).thenReturn(resource);
        ResponseEntity<Resource> response = fileController.downloadFile(path.toString());

        assertEquals(resource.getFile().getName(), response.getBody().getFile().getName());
    }

    private String mapToJson(Object object) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(object);
    }
}
