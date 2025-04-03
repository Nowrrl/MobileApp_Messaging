package com.teleport.cs310_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.teleport.cs310_project.model.User;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}