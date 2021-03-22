package com.donghoonkhan.httpfileserver.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.donghoonkhan.httpfileserver.AbstractIntegrationTest;
import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.model.FileResponse;
import com.donghoonkhan.httpfileserver.model.FileType;
import com.donghoonkhan.httpfileserver.service.FileService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FileControllerTests extends AbstractIntegrationTest {
    
    @MockBean
    private FileService fileService;

    @TempDir
    Path path;

    private FileController fileController;

    @BeforeEach
    void setup() {
        fileController = new FileController(path.toString(), fileService);
    }

    @Test
    public void Test_GetAllFileAsFileResponse() throws Exception {
        List<FileResponse> files = new ArrayList<>();
        FileResponse fileResponse = FileResponse.builder()
            .createdAt(Instant.now())
            .modifiedAt(Instant.now())
            .name("test")
            .size(1L)
            .uri("/test")
            .build();
        files.add(fileResponse);
        String expected = mapToJson(files);
        
        Mockito.when(fileService.getAllFilesAsFileResponse(path.toString())).thenReturn(files);
        ResponseEntity<List<FileResponse>> response = fileController.getAllFiles(null);

        assertEquals(expected, mapToJson(response.getBody()));
        assertEquals(HttpStatus.OK,response.getStatusCode());
    }

    private String mapToJson(Object object) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.writeValueAsString(object);
	}
}
