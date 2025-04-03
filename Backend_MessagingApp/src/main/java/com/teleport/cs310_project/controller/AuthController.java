

/*package com.teleport.cs310_project.controller;

import com.teleport.cs310_project.model.User;
import com.teleport.cs310_project.service.user_service.UserService;
import com.teleport.cs310_project.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    // User registration endpoint
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        logger.info("Registering user: {}", user.getEmail());
        userService.registerUser(user);
        logger.info("User registered successfully: {}", user.getEmail());
        return "User registered successfully";
    }

    // User login endpoint with JWT
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        logger.info("Attempting login for user: {}", user.getEmail());

        // Find the user by email@gmail
        User foundUser = userService.findUserByEmail(user.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login failed for user: {} - User not found", user.getEmail());
                    return new RuntimeException("User not found");
                });

        // Check if passwords match
        if (user.getPassword().equals(foundUser.getPassword())) {
            logger.info("Login successful for user: {}", foundUser.getEmail());
            // Generate JWT token
            String token = jwtUtil.generateToken(foundUser.getEmail());
            return token;
        } else {
            logger.warn("Login failed for user: {} - Invalid credentials", user.getEmail());
            throw new RuntimeException("Invalid credentials");
        }
    }
}
*/

package com.teleport.cs310_project.controller;

import com.teleport.cs310_project.model.User;
import com.teleport.cs310_project.service.user_service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @GetMapping("/users")
    public List<User> getAllUsers() {
        logger.info("Fetching all users.");
        return userService.getAllUsers();
    }

    // User registration endpoint
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        logger.info("Registering user: {}", user.getEmail());
        userService.registerUser(user);
        logger.info("User registered successfully: {}", user.getEmail());
        return "User registered successfully";
    }

    // User login endpoint
    @PostMapping("/login")
    public User login(@RequestBody User user) {
        logger.info("Attempting login for user: {}", user.getEmail());

        User foundUser = userService.findUserByEmail(user.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login failed for user: {} - User not found", user.getEmail());
                    return new RuntimeException("User not found");
                });

        if (user.getPassword().equals(foundUser.getPassword())) {
            logger.info("Login successful for user: {}", foundUser.getEmail());
            return foundUser; // Return the user object directly
        } else {
            logger.warn("Login failed for user: {} - Invalid credentials", user.getEmail());
            throw new RuntimeException("Invalid credentials");
        }
    }
}
