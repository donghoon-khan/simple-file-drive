package com.donghoonkhan.httpfileserver.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DirectoryResponse {
    
    private String path;
    private Long size;
    private Instant createdAt;
    private Instant modifiedAt;
    private List<FileResponse> files;
    private List<DirectoryResponse> subDirectories = new ArrayList<>();
}
