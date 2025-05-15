package com.chat.service;

import com.chat.entity.User;

import java.util.List;

public interface UserService {
    User saveUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    User findByEmail(String email);

}