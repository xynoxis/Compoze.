package com.harshit.blog.user.web;

import com.harshit.blog.auth.dto.UserResponse;
import com.harshit.blog.user.dto.PublicUserProfileResponse;
import com.harshit.blog.user.dto.UpdateProfileRequest;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        return UserResponse.from(user);
    }

    @PutMapping("/me")
    public UserResponse updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        UUID userId = (UUID) authentication.getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        if (request.displayName() != null) {
            user.setDisplayName(request.displayName());
        }
        if (request.bio() != null) {
            user.setBio(request.bio());
        }
        if (request.avatarUrl() != null) {
            user.setAvatarUrl(request.avatarUrl());
        }

        User updated = userRepository.save(user);
        return UserResponse.from(updated);
    }

    @GetMapping("/{username}")
    public PublicUserProfileResponse getPublicProfile(
            @PathVariable String username
    ) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        return PublicUserProfileResponse.from(user);
    }
}
