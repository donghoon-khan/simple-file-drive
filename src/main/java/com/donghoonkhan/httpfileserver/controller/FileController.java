package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.service.FileService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/root")
public class FileController {
    
    private final String rootDir;
    private final FileService fileService;

    public FileController(@Value("${rootDir}")String rootDir, FileService fileService) {
        this.rootDir = rootDir;
        this.fileService = fileService;
    }

    @ApiOperation(value = "Root Dir 조회")
    @GetMapping("/")
    public ResponseEntity<List<FileObject>> listFilesAndDirectories() {
        try {
            return ResponseEntity.ok().body(fileService.getAllFilesAndDirectories(Paths.get(rootDir)));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
