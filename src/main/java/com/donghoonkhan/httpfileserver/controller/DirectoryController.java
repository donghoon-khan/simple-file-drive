package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;
import com.donghoonkhan.httpfileserver.service.DirectoryService;

import io.swagger.annotations.ApiOperation;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
public class DirectoryController {

    private final DirectoryService directoryService;
    private final String rootPath;

    public DirectoryController(DirectoryService directoryService, @Value("${rootPath}")String rootPath) {
        this.directoryService = directoryService;
        this.rootPath = rootPath;
    }

    @ApiOperation(value = "Retrieve directory")
    @GetMapping(value="/directory")
    public ResponseEntity<DirectoryResponse> retrieveDirectory(@RequestParam(required = false, value = "directory") String directory) {
        
        try {
            if (directory == null) {
                return ResponseEntity.ok().body(directoryService.getDirectory(rootPath));
            }
            return ResponseEntity.ok().body(directoryService.getDirectory(directory));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
