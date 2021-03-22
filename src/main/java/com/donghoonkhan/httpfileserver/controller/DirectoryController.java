package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;

import com.donghoonkhan.httpfileserver.model.DirectoryResponse;
import com.donghoonkhan.httpfileserver.service.DirectoryService;

import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequiredArgsConstructor
public class DirectoryController {

    private final DirectoryService directoryService;

    @ApiOperation(value = "Retrieve directory")
    @GetMapping(value="/directory")
    public ResponseEntity<DirectoryResponse> retrieveDirectory(@RequestParam(required = true, value = "directory") String directory) {
        
        try {
            return ResponseEntity.ok().body(directoryService.getDirectory(directory));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
