package com.chat.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String username;  // login using username

    @NotBlank
    private String password;
}
