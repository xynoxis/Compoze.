package com.harshit.blog;

import com.harshit.blog.post.repository.PostRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BlogBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlogBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner cleanupOldTestPosts(PostRepository postRepository) {
		return args -> {
			postRepository.findAll().stream()
					.filter(p -> "Published".equalsIgnoreCase(p.getTitle()))
					.forEach(postRepository::delete);
		};
	}
}
