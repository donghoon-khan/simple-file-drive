package com.donghoonkhan.httpfileserver.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.file.Path;

import com.donghoonkhan.httpfileserver.AbstractIntegrationTest;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "rootDir=/donghoon-khan"
})
public class PathConfigurationTests extends AbstractIntegrationTest {
    
    @Autowired PathConfig pathConfig;
    @Autowired Path path;

    @Test
    public void Test_Make_PathConfiguration_From_Property() {
        assertEquals("/donghoon-khan", pathConfig.getRootDir());
    }

    @Test
    public void Test_Make_Path_From_Property() {
        assertEquals("/donghoon-khan", path.toString());
    }
}
