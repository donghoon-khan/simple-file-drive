package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;
import java.util.List;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;
import com.donghoonkhan.httpfileserver.service.DirectoryService;

import io.swagger.annotations.ApiOperation;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    @GetMapping(value = "/directories")
    public ResponseEntity<List<DirectoryResponse>> retrieveDirectory(
            @RequestParam(required = false, value = "directory")String directory) {
        
        try {
            if (directory == null) {
                return ResponseEntity.ok().body(directoryService.getListDirectories(rootPath));
            }
            return ResponseEntity.ok().body(directoryService.getListDirectories(directory));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @ApiOperation(value = "Create directory")
    @PostMapping(value = "/directory")
    public ResponseEntity<Void> createDirectory(
            @RequestParam(required = true, value = "directory")String directory) {

        try {
            directoryService.createDirectory(directory);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    @ApiOperation(value = "Delete directory")
    @DeleteMapping(value = "/directory")
    public ResponseEntity<Void> deleteDirectory(
            @RequestParam(required = true, value = "directory")String directory) {

        try {
            directoryService.deleteDirectory(directory);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

}
