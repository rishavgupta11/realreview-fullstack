package com.realreview.controller;

import com.realreview.entity.PropertyImage;
import com.realreview.repository.PropertyImageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PropertyImageRepository imageRepository;

    public AdminController(PropertyImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    // Get all pending (unapproved) images
    @GetMapping("/pending-images")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<PropertyImage>> getPendingImages() {
        List<PropertyImage> pendingImages = imageRepository.findByApprovedFalseOrderByUploadedAtDesc();
        return ResponseEntity.ok(pendingImages);
    }
}
