package com.harshit.blog.user;

import com.harshit.blog.AbstractIntegrationTest;
import com.harshit.blog.user.entity.User;
import com.harshit.blog.user.entity.UserRole;
import com.harshit.blog.user.entity.UserStatus;
import com.harshit.blog.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class UserRepositoryIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldPersistAndRetrieveUser() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User user = new User(
                "user_" + suffix,
                "user_" + suffix + "@example.com",
                "hashed-password"
        );

        User saved = userRepository.saveAndFlush(user);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUsername()).isEqualTo("user_" + suffix);
        assertThat(saved.getEmail()).isEqualTo("user_" + suffix + "@example.com");
        assertThat(saved.getRole()).isEqualTo(UserRole.USER);
        assertThat(saved.getStatus()).isEqualTo(UserStatus.ACTIVE);
        assertThat(saved.isEmailVerified()).isFalse();

        Optional<User> found = userRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("user_" + suffix);
    }

    @Test
    void shouldFindUserByEmailIgnoringCase() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User user = new User(
                "email_" + suffix,
                "CaseTest_" + suffix + "@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Optional<User> found = userRepository.findByEmailIgnoreCase(
                ("casetest_" + suffix + "@EXAMPLE.COM")
        );

        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("email_" + suffix);
    }

    @Test
    void shouldFindUserByUsernameIgnoringCase() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User user = new User(
                "CaseUser_" + suffix,
                "caseuser_" + suffix + "@example.com",
                "hashed-password"
        );

        userRepository.saveAndFlush(user);

        Optional<User> found = userRepository.findByUsernameIgnoreCase("caseuser_" + suffix);

        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("caseuser_" + suffix + "@example.com");
    }
}
