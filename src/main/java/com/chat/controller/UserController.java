package com.chat.controller;

import com.chat.dto.UserDTO;
import java.util.stream.Collectors;
import com.chat.entity.User;
import com.chat.repository.UserRepository;
import com.chat.service.UserService;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

   

    // Get current logged-in user's profile
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUserProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserDTO dto = UserDTO.builder()
            .id(user.getId())
            .username(user.getUsername()) // changed here
            .email(user.getEmail())
            .role(user.getRole())
            .enabled(user.isEnabled())
            .build();

        return ResponseEntity.ok(dto);
    }

    // Get user by id
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id){
        User user = userService.getUserById(id);
        if(user == null){
            return ResponseEntity.notFound().build();
        }
        UserDTO dto = UserDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole())
            .enabled(user.isEnabled())
            .build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public List<UserDTO> getAllUsers(){
        return userService.getAllUsers().stream().map(user -> UserDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole())
            .enabled(user.isEnabled())
            .build()
        ).collect(Collectors.toList());
    }

}
