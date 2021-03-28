package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.service.DirectoryService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/directory")
public class DirectoryController {

    private final DirectoryService directoryService;

    @GetMapping("/**")
    public ResponseEntity<List<FileObject>> retrieveDirectory(HttpServletRequest request) throws IOException {
        return ResponseEntity.ok().body(directoryService.getDirectory(getRelPath(request)));
    }

    @PostMapping("/**")
    public ResponseEntity<Void> createDirectory(HttpServletRequest request) throws IOException {
        directoryService.createDirectory(getRelPath(request));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    /*@PutMapping("/**")
    public ResponseEntity<Void> renameAndMoveDirectory(@RequestParam(value = "target", required = true) String target, 
            @RequestParam(value = "force", required = false, defaultValue = "false") Boolean force, 
            HttpServletRequest request) throws IOException {
        
    }*/

    @DeleteMapping("/**")
    public ResponseEntity<Void> deleteDirectory(HttpServletRequest request) throws IOException {
        directoryService.deleteDirectory(getRelPath(request));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    private String getRelPath(HttpServletRequest request) {
        if (request.getRequestURI().equals("/directory")) {
            return "/";
        }
        return request.getRequestURI().split(request.getContextPath() + "/directory")[1];
    }
}
