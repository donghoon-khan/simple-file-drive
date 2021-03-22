package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.donghoonkhan.httpfileserver.model.FileResponse;
import com.donghoonkhan.httpfileserver.service.FileService;
import com.google.common.net.HttpHeaders;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.annotations.ApiOperation;

@RestController
public class FileController {
    
    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @ApiOperation(value = "List files")
    @GetMapping("/files")
    public ResponseEntity<List<FileResponse>> getAllFiles(@RequestParam(required = true, value = "path")String path) {
        try {
            return ResponseEntity.ok().body(fileService.getListFiles(path));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Download file")
    @GetMapping("/file")
    public ResponseEntity<Resource> downloadFile(@RequestParam(required = true, value = "file")String file) {
        try {
            Resource resource = fileService.getFileAsResource(file);
            String contentType = Files.probeContentType(Paths.get(file));
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
