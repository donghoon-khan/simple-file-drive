package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.donghoonkhan.httpfileserver.model.FileObject;
import com.donghoonkhan.httpfileserver.model.FileResponse;
import com.donghoonkhan.httpfileserver.service.FileService;
import com.google.common.net.HttpHeaders;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class FileController {
    
    private final String rootDir;
    private final FileService fileService;

    public FileController(@Value("${rootDir}")String rootDir, FileService fileService) {
        this.rootDir = rootDir;
        this.fileService = fileService;
    }

    @ApiOperation(value = "List files")
    @GetMapping("/files")
    public ResponseEntity<List<FileResponse>> getAllFiles(@RequestParam(required = false, value = "path")String path) {
        log.info("=======================");
        log.info("=======================");
        try {
            String directory = rootDir;
            if (path != null && path.startsWith("/")) {
                directory += path;
            } else if(path != null) {
                directory = directory + "/" + path;
            }
            return ResponseEntity.ok().body(fileService.getAllFilesAsFileResponse(directory));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Root Dir 조회")
    //@GetMapping("/files")
    public ResponseEntity<List<FileObject>> listFilesAndDirectories() {
        try {
            return ResponseEntity.ok().body(fileService.getAllFilesAndDirectories(rootDir));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Download file")
    @GetMapping("/file/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileService.loadFileAsResource(rootDir + "/" + fileName);
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.info("Could not determine file type.");
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
