package se.comerit.avanza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.comerit.avanza.entity.User;

// Repository for User entity
public interface UserRepository extends JpaRepository<User, Long> {
}
