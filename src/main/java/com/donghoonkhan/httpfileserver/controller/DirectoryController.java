package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.service.DirectoryService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value = "/api/directory")
public class DirectoryController {

    private final DirectoryService directoryService;
    private final String basePath;

    public DirectoryController(DirectoryService directoryService, @Value("${basePath}") String basePath) {
        this.directoryService = directoryService;
        this.basePath = basePath;
    }

    @ApiOperation(value = "Retrieve directory", notes = "Pass the relative path of the set basepath to URI.")
    @GetMapping("/**")
    public ResponseEntity<List<FileObject>> retrieveDirectory(HttpServletRequest request) throws IOException {
        return ResponseEntity.ok().body(directoryService.getDirectory(getRelPath(request)));
    }

    @ApiOperation(value = "Create directory", notes = "Pass the relative path of the set basepath to URI.")
    @PostMapping("/**")
    public ResponseEntity<Void> createDirectory(HttpServletRequest request) throws IOException {
        directoryService.createDirectory(getRelPath(request));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @ApiOperation(value = "Rename/move directory", notes = "Pass the relative path of the set basepath to URI.")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "target", value = "Target path, Pass the relative path of the set basepath to URI.", required = true),
        @ApiImplicitParam(name = "force", value = "Whether to overwrite.", required = false, defaultValue = "false")
    })
    @PutMapping("/**")
    public ResponseEntity<Void> renameAndMoveDirectory(@RequestParam(value = "target", required = true) String target, 
            @RequestParam(value = "force", required = false, defaultValue = "false") Boolean force, 
            HttpServletRequest request) throws IOException {
        
        String targetURI  = target.startsWith("/") ? basePath + target : basePath + "/" + target;
        directoryService.moveDirectory(getRelPath(request), targetURI, force);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @ApiOperation(value = "Delete directory", notes = "Pass the relative path of the set basepath to URI.")
    @DeleteMapping("/**")
    public ResponseEntity<Void> deleteDirectory(HttpServletRequest request) throws IOException {
        directoryService.deleteDirectory(getRelPath(request));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    private String getRelPath(HttpServletRequest request) {
        if (request.getRequestURI().equals("/directory")) {
            return basePath;
        }
        return basePath + request.getRequestURI().split(request.getContextPath() + "/directory")[1];
    }
}
