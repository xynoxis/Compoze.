package com.harshit.blog.common.web;

import com.harshit.blog.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class HealthControllerIntegrationTest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void shouldPermitAccessToHealthEndpointWithoutAuthentication() {
        String url = "http://localhost:" + port + "/api/health";
        HealthController.HealthResponse response =
                restTemplate.getForObject(url, HealthController.HealthResponse.class);

        assertThat(response).isNotNull();
        assertThat(response.status()).isEqualTo("UP");
    }
}
