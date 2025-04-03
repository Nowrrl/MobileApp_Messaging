package com.teleport.cs310_project.service.user_service;

import com.teleport.cs310_project.model.User;
import com.teleport.cs310_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public String registerUser(User user) {
        // Check if the email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists.");
        }

        // Save the user with email and password
        userRepository.save(user);
        return "User registered successfully!";
    }

    @Override
    public List<User> getAllUsers() {
        // Return all users
        return userRepository.findAll();
    }


    @Override
    public Optional<User> findUserByEmail(String email) {
        // Find the user by their email address
        return userRepository.findByEmail(email);
    }
    @Override
    public User getUserById(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.orElse(null);
    }
}
