package com.donghoonkhan.httpfileserver.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;
import com.donghoonkhan.httpfileserver.model.FileInfo;
import com.donghoonkhan.httpfileserver.model.FileResponse;
import com.donghoonkhan.httpfileserver.service.DirectoryService;
import com.donghoonkhan.httpfileserver.service.FileService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DirectoryServiceImpl implements DirectoryService {

    private final FileService fileService;

    @Override
    public void createDirectory(String path, String directoryName) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public DirectoryResponse getDirectory(String path) throws ResponseStatusException {

        try {
            return DirectoryResponse.builder()
                    .files(fileService.getAllFilesAsFileResponse(path))
                    .build();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}
