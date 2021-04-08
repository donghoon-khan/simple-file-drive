package com.donghoonkhan.httpfileserver.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import com.donghoonkhan.httpfileserver.service.FileService;
import com.google.common.net.HttpHeaders;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value = "/api/file")
public class FileController {
    
    private final FileService fileService;
    private final String basePath;

    public FileController(FileService fileService, @Value("${basePath}") String basePath) {
        this.fileService = fileService;
        this.basePath = basePath;
    }

    @ApiOperation(value = "Download file", notes = "Pass the relative path of the set basepath to URI.")
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

    @ApiOperation(value = "Rename/move file", notes = "Pass the relative path of the set basepath to URI.")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "target", value = "Target path, Pass the relative path of the set basepath to URI.", required = true),
        @ApiImplicitParam(name = "force", value = "Whether to overwrite.", required = false, defaultValue = "false")
    })
    @PutMapping("/**")
    public ResponseEntity<Void> renameAndMoveFiley(@RequestParam(value = "target", required = true) String target, 
            @RequestParam(value = "force", required = false, defaultValue = "false") Boolean force, 
            HttpServletRequest request) throws IOException {

        String targetURI  = target.startsWith("/") ? basePath + target : basePath + "/" + target;
        fileService.moveFile(getRelPath(request), targetURI, force);
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "upload file", notes = "Pass the relative path about upload directory of the set basepath to URI.")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "file", value = "Upload file.", required = true),
        @ApiImplicitParam(name = "force", value = "Whether to overwrite.", required = false, defaultValue = "false")
    })
    @PostMapping("/**")
    public ResponseEntity<Void> uploadFile(@RequestParam(value = "file", required = true) MultipartFile file, 
            @RequestParam(value = "force", required = false, defaultValue = "false") Boolean force,
            HttpServletRequest request) throws IOException {

        fileService.storeFile(getRelPath(request), file, force);
        return ResponseEntity.ok().build();
    }

    private String getRelPath(HttpServletRequest request) {
        if (request.getRequestURI().equals("/file")) {
            return basePath;
        }
        return basePath + request.getRequestURI().split(request.getContextPath() + "/file")[1];
    }
}
