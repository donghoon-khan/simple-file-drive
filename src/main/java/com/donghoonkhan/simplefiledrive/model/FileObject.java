package com.donghoonkhan.simplefiledrive.model;

import java.time.Instant;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class FileObject {
    
    private String name;
    private String path;
    private String type;
    private Long size;
    private Instant createdAt;
    private Instant modifiedAt;
}
