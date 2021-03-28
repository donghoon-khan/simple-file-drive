package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/file")
public class FileController {
    
    private final FileService fileService;

    @GetMapping("/**")
    public ResponseEntity<Resource> downloadFile(HttpServletRequest request) throws IOException {
        Resource resource = fileService.getFileAsResource(getRelPath(request));
        String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PutMapping("/**")
    public ResponseEntity<Void> renameAndMoveFiley(@RequestParam(value = "target", required = true) String target, 
            @RequestParam(value = "force", required = false, defaultValue = "false") Boolean force, 
            HttpServletRequest request) throws IOException {

        fileService.moveFile(getRelPath(request), target, force);
        return ResponseEntity.ok().build();
    }

    private String getRelPath(HttpServletRequest request) {
        if (request.getRequestURI().equals("/file")) {
            return "/";
        }
        return request.getRequestURI().split(request.getContextPath() + "/file")[1];
    }
    

    /*
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
    }*/
}
