package com.chat.security;

//package com.chat.security;

import com.chat.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

 private final User user;

 public CustomUserDetails(User user) {
     this.user = user;
 }

 @Override
 public Collection<? extends GrantedAuthority> getAuthorities() {
     // assuming role stored like "USER" or "ADMIN"
     return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
 }

 @Override
 public String getPassword() {
     return user.getPassword();
 }

 @Override
 public String getUsername() {
     return user.getUsername();
 }

 @Override
 public boolean isAccountNonExpired() {
     return true; // implement if you have this logic
 }

 @Override
 public boolean isAccountNonLocked() {
     return true; // implement if you have this logic
 }

 @Override
 public boolean isCredentialsNonExpired() {
     return true; // implement if you have this logic
 }

 @Override
 public boolean isEnabled() {
     return user.isEnabled();
 }
}
