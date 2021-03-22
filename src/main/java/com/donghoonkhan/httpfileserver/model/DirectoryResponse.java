package com.donghoonkhan.httpfileserver.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DirectoryResponse {
    
    private String name;
    private String uri;
    private Long size;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private List<FileResponse> files;
    private List<DirectoryResponse> subDirectories;
}
