package com.donghoonkhan.httpfileserver.model;

import java.time.Instant;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DirectoryResponse {
    
    private String name;
    private String path;
    private Long size;
    private Instant createdAt;
    private Instant modifiedAt;
}
