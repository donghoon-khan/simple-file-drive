package com.donghoonkhan.httpfileserver.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import com.donghoonkhan.httpfileserver.AbstractIntegrationTest;
import com.donghoonkhan.httpfileserver.model.DirectoryResponse;
import com.donghoonkhan.httpfileserver.service.DirectoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;

public class DirectoryControllerTests extends AbstractIntegrationTest {
    
    @MockBean
    private DirectoryService directoryService;

    @TempDir
    Path directory;

    private DirectoryController directoryController;

    @BeforeEach
    void setup() {
        directoryController = new DirectoryController(directoryService, directory.toString());
    }

    @Test
    void Test_RetrieveDirectory() throws Exception {
        DirectoryResponse directory = DirectoryResponse.builder().name("test").path("./test").build();
        List<DirectoryResponse> directoryResponse = new ArrayList<>();
        directoryResponse.add(directory);
        
        String expected = mapToJson(directoryResponse);
        Mockito.when(directoryService.getListDirectories(directory.toString())).thenReturn(directoryResponse);
        ResponseEntity<List<DirectoryResponse>> response = directoryController.retrieveDirectory(directory.toString());

        assertEquals(expected, mapToJson(response.getBody()));
        assertEquals("test", response.getBody().get(0).getName());
        assertEquals("./test", response.getBody().get(0).getPath());
    }

    private String mapToJson(Object object) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(object);
    }
}
