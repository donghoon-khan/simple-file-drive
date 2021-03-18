package com.donghoonkhan.httpfileserver.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Getter
@Configuration
public class PathConfig {
    
    private final String rootDir;
    public PathConfig(@Value("${rootDir}")String rootDir) {
        this.rootDir = rootDir;
    }

    @Bean 
    public Path httpFileServerRootPath() {
        return Paths.get(rootDir);
    }
}
