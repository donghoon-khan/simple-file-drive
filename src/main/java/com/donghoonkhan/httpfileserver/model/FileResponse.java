package com.donghoonkhan.httpfileserver.model;

import java.net.URI;
import java.time.Instant;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileResponse {
    
    private String name;
    private URI uri;
    private String mimeType;
    private Long size;
    private Instant createdAt;
    private Instant modifiedAt;
}
