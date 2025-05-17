package com.chat.controller;

import com.chat.dto.UserDTO;
import com.chat.entity.User;
import com.chat.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    // Get current logged-in user's profile
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();  // Typically username is principal name

        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(toDTO(user));
    }

    // Get user by id
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id){
        User user = userService.getUserById(id);
        if(user == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toDTO(user));
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        List<UserDTO> users = userService.getAllUsers().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build();
    }
}
