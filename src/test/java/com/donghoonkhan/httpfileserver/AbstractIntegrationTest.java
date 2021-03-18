package com.donghoonkhan.httpfileserver;

import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@DirtiesContext
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {
    
    public AbstractIntegrationTest() {
        super();
    }
}
