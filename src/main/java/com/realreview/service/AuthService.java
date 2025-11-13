package com.realreview.service;

import com.realreview.dto.*;
import com.realreview.entity.User;
import com.realreview.enums.Role;
import com.realreview.exception.*;
import com.realreview.repository.UserRepository;
import com.realreview.security.JwtUtil;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);
        userRepository.save(user);
        return "User registered successfully";
    }

    public TokenResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String access = jwtUtil.generateToken(request.getEmail());
        String refresh = jwtUtil.generateRefreshToken(request.getEmail());
        return new TokenResponse(access, refresh);
    }

    public TokenResponse refresh(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        String email = jwtUtil.getUsernameFromToken(refreshToken);
        String newAccess = jwtUtil.generateToken(email);
        String newRefresh = jwtUtil.generateRefreshToken(email);
        return new TokenResponse(newAccess, newRefresh);
    }
}
