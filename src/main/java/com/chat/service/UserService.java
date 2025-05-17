package com.chat.service;

import com.chat.entity.User;

import java.util.List;

public interface UserService {
	
	 User findByUsername(String username);

    User saveUser(User user);

    User getUserById(Long id);


    public List<User> getAllUsers();

    User findByEmail(String email);
}
