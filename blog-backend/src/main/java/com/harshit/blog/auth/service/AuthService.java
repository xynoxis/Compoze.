package com.harshit.blog.auth.service;

import com.harshit.blog.auth.dto.LoginRequest;
import com.harshit.blog.auth.dto.RefreshTokenResponse;
import com.harshit.blog.auth.dto.RegisterRequest;
import com.harshit.blog.auth.dto.UserResponse;
import com.harshit.blog.auth.entity.RefreshToken;
import com.harshit.blog.auth.repository.RefreshTokenRepository;
import com.harshit.blog.common.security.JwtService;
import com.harshit.blog.common.security.RefreshTokenService;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.entity.UserStatus;
import com.harshit.blog.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            RefreshTokenRepository refreshTokenRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByUsernameIgnoreCase(
                request.username()
        )) {
            throw new IllegalArgumentException(
                    "Username is already in use"
            );
        }

        if (userRepository.existsByEmailIgnoreCase(
                request.email()
        )) {
            throw new IllegalArgumentException(
                    "Email is already in use"
            );
        }

        String passwordHash =
                passwordEncoder.encode(request.password());

        User user = new User(
                request.username(),
                request.email(),
                passwordHash,
                request.displayName()
        );

        User savedUser =
                userRepository.save(user);

        return UserResponse.from(savedUser);
    }

    @Transactional
    public RefreshTokenResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmailIgnoreCase(request.email())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
        )) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "User account is not active"
            );
        }

        String accessToken =
                jwtService.generateAccessToken(
                        user.getId(),
                        user.getUsername()
                );

        String refreshToken =
                refreshTokenService.create(user);

        return new RefreshTokenResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtService.getAccessTokenExpirationSeconds()
        );
    }

    @Transactional
    public RefreshTokenResponse refresh(String rawRefreshToken) {

        String hash =
                refreshTokenService.hash(rawRefreshToken);

        RefreshToken storedToken =
                refreshTokenRepository
                        .findByTokenHash(hash)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid refresh token"
                                )
                        );

        if (storedToken.isRevoked() || storedToken.isExpired()) {
            throw new IllegalArgumentException(
                    "Invalid refresh token"
            );
        }

        User user = storedToken.getUser();

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "User account is not active"
            );
        }

        // Revoke old token.
        storedToken.revoke();

        String newRefreshToken =
                refreshTokenService.create(user);

        String accessToken =
                jwtService.generateAccessToken(
                        user.getId(),
                        user.getUsername()
                );

        return new RefreshTokenResponse(
                accessToken,
                newRefreshToken,
                "Bearer",
                jwtService.getAccessTokenExpirationSeconds()
        );
    }
}
