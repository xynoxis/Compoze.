package com.harshit.blog;

import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
public abstract class AbstractIntegrationTest {
}
