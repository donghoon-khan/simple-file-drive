package com.donghoonkhan.httpfileserver.model;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileInfo {
    
    private Boolean isDirectory;
    private String name;
    private String uri;
    private String mimeType;
    private Long size;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
