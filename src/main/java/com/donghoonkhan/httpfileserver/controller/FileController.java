package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.donghoonkhan.httpfileserver.model.FileResponse;
import com.donghoonkhan.httpfileserver.service.FileService;
import com.google.common.net.HttpHeaders;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.annotations.ApiOperation;

@RestController
public class FileController {
    
    private final FileService fileService;
    private final String rootPath;

    public FileController(FileService fileService, @Value("${rootPath}")String rootPath) {
        this.fileService = fileService;
        this.rootPath = rootPath;
    }

    @ApiOperation(value = "List files")
    @GetMapping("/files")
    public ResponseEntity<List<FileResponse>> getAllFiles(@RequestParam(required = false, value = "directory")String directory) {
        try {
            if (directory == null) {
                return ResponseEntity.ok().body(fileService.getListFiles(rootPath));
            }
            return ResponseEntity.ok().body(fileService.getListFiles(directory));
            
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @ApiOperation(value = "Upload file")
    @PostMapping("/file")
    public ResponseEntity<Void> uploadFile(
            @RequestParam(required = false, value = "directory")String directory,
            @RequestParam("file") MultipartFile file) {
        
        try {
            if (directory == null) {
                fileService.storeFile(rootPath, file);
            } else {
                fileService.storeFile(directory, file);
            }
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @ApiOperation(value = "Rename/Move file")
    @PutMapping("/file")
    public ResponseEntity<Void> renameAndMoveFile(
            @RequestParam(required = true, value = "src") String src,
            @RequestParam(required = true, value = "dst") String dst,
            @RequestParam(required = false, value = "overwrite", defaultValue = "false") Boolean overwrite) {

        try {
            fileService.moveFile(src, dst, overwrite);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}
