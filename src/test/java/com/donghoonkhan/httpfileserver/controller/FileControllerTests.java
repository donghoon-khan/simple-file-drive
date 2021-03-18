package com.donghoonkhan.httpfileserver.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import com.donghoonkhan.httpfileserver.AbstractIntegrationTest;
import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.model.FileType;
import com.donghoonkhan.httpfileserver.service.FileService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@AutoConfigureMockMvc
public class FileControllerTests extends AbstractIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FileService fileService;

    @TempDir
    Path path;

    @Test
    @DisplayName("GET /root/ success")
    void Test_Get_ListFilesAndDirectories() throws Exception {
        List<FileObject> fileObjects = new ArrayList<>();
        FileObject fileObject = FileObject.builder()
                .type(FileType.FILE)
                .path("/test/test.file")
                .name("test.file")
                .build();

        String expected = mapToJson(fileObjects);

        fileObjects.add(fileObject);
        Mockito.when(fileService.getAllFilesAndDirectories(path)).thenReturn(fileObjects);
        
        RequestBuilder requestBuilder = MockMvcRequestBuilders.get("/root/")
                .accept(MediaType.APPLICATION_JSON)
                .content(expected)
                .contentType(MediaType.APPLICATION_JSON);

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        MockHttpServletResponse response = result.getResponse();

        String actual = response.getContentAsString();
        assertEquals(expected, actual);
        assertEquals(HttpStatus.OK.value(), response.getStatus());
    }

    private String mapToJson(Object object) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.writeValueAsString(object);
	}
}
