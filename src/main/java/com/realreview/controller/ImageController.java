package com.realreview.controller;

import com.realreview.entity.PropertyImage;
import com.realreview.entity.User;
import com.realreview.repository.PropertyImageRepository;
import com.realreview.repository.UserRepository;
import com.realreview.security.JwtUtil;
import com.realreview.service.FileStorageService;
import com.realreview.service.ImageService;
import com.realreview.service.LocationValidatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin("*")
public class ImageController {

    private final FileStorageService fileStorageService;
    private final PropertyImageRepository imageRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final ImageService imageService;
    private final LocationValidatorService locationValidatorService;

    @Autowired
    public ImageController(FileStorageService fileStorageService,
                           PropertyImageRepository imageRepository,
                           UserRepository userRepository,
                           JwtUtil jwtUtil,
                           ImageService imageService,
                           LocationValidatorService locationValidatorService) {
        this.fileStorageService = fileStorageService;
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.imageService = imageService;
        this.locationValidatorService = locationValidatorService;
    }

    // 1. Upload image (user only, with location validation)
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("location") String location,
            @RequestHeader("Authorization") String token) {

        try {
            // Extract user email from JWT
            String jwt = token.replace("Bearer ", "");
            String userEmail = jwtUtil.getUsernameFromToken(jwt);
            User uploader = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validate location using Google Maps Geocoding API
            var locationData = locationValidatorService.validateLocation(location);

            // Save file to local disk
            String fileName = fileStorageService.storeFile(file);

            // Save image metadata
            PropertyImage image = new PropertyImage();
            image.setFileName(fileName);
            image.setLocation(locationData.formattedAddress());
            image.setLatitude(locationData.latitude());
            image.setLongitude(locationData.longitude());
            image.setUploadedAt(LocalDateTime.now());
            image.setUploadedBy(uploader);
            image.setApproved(false);

            imageRepository.save(image);

            return ResponseEntity.ok("Image uploaded and location validated: "
                    + locationData.formattedAddress());

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("⚠️ Error: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed: " + e.getMessage());
        }
    }

    // 2. Get approved images (public + optional location + pagination)
    @GetMapping("/public")
    public ResponseEntity<List<PropertyImage>> getApprovedImages(
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<PropertyImage> images = imageService.getApprovedImages(location, page, size);
        return ResponseEntity.ok(images);
    }

    // 3. View image file by filename (public)
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = fileStorageService.loadFile(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 4. Approve image (admin only)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<String> approveImage(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {

        try {
            String jwt = token.replace("Bearer ", "");
            String adminEmail = jwtUtil.getUsernameFromToken(jwt);
            imageService.approveImage(id, adminEmail);

            return ResponseEntity.ok("Image approved successfully.");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Approval failed.");
        }
    }

    // 5. Rate an image
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/{id}/rate")
    public ResponseEntity<String> rateImage(
            @PathVariable Long id,
            @RequestParam int rating,
            @RequestHeader("Authorization") String token) {

        try {
            String jwt = token.replace("Bearer ", "");
            String email = jwtUtil.getUsernameFromToken(jwt);

            imageService.rateImage(id, email, rating);

            return ResponseEntity.ok("Rating submitted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(" Invalid rating: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to submit rating.");
        }
    }

    // 6. Get image details with metadata + ratings (public)
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getImageDetails(@PathVariable Long id) {
        try {
            PropertyImage image = imageService.getImageDetails(id);
            return ResponseEntity.ok(image);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("⚠️ " + e.getMessage());
        }
    }
}
