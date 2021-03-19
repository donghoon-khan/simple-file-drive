package com.donghoonkhan.httpfileserver.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileObject {
    FileType type;
    String name;
    String path;
    String mimeType;
}
