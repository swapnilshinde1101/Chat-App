package com.chat.controller;

import com.chat.security.JwtUtil;
import com.chat.security.CustomUserDetailsService;
import com.chat.request.LoginRequest;
import com.chat.response.LoginResponse;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authManager, CustomUserDetailsService uds, JwtUtil jwtUtil) {
        this.authenticationManager = authManager;
        this.userDetailsService = uds;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String token = jwtUtil.generateToken(userDetails.getUsername());
        return new LoginResponse("Login successful", token);
    }
}
