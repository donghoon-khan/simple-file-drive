package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;
import com.donghoonkhan.httpfileserver.service.DirectoryService;

import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
public class DirectoryController {

    private final String rootDir;
    private final DirectoryService directoryService;

    public DirectoryController(@Value("${rootDir}")String rootDir, DirectoryService directoryService) {
        this.rootDir = rootDir;
        this.directoryService = directoryService;
    }

    @ApiOperation(value = "directory 조회")
    @GetMapping(value="/directory")
    public DirectoryResponse getHttpFileDirectory(@RequestParam(required = false) String path) {

        
        return directoryService.getDirectory(rootDir);
    }
}
