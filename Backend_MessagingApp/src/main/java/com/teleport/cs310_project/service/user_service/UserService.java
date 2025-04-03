package com.teleport.cs310_project.service.user_service;

import com.teleport.cs310_project.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    String registerUser(User user);
    Optional<User> findUserByEmail(String email);
    List<User> getAllUsers();
    User getUserById(String userId);

}

