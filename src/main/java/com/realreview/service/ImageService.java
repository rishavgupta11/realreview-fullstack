package com.realreview.service;

import com.realreview.entity.ImageRating;
import com.realreview.entity.PropertyImage;
import com.realreview.entity.User;
import com.realreview.enums.Role;
import com.realreview.repository.ImageRatingRepository;
import com.realreview.repository.PropertyImageRepository;
import com.realreview.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ImageService {

    @Autowired
    private PropertyImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageRatingRepository ratingRepository;

    // Approve image (Admin only)
    public void approveImage(Long id, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() == null || admin.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Access denied. Admin privileges required.");
        }

        PropertyImage image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        image.setApproved(true);
        imageRepository.save(image);
    }

    // Get approved images (paginated + optional location)
    public List<PropertyImage> getApprovedImages(String location, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PropertyImage> pageResult =
                (location != null && !location.isEmpty())
                        ? imageRepository.findByLocationAndApprovedTrue(location, pageable)
                        : imageRepository.findByApprovedTrue(pageable);

        List<PropertyImage> images = pageResult.getContent();

        // Compute average rating
        for (PropertyImage img : images) {
            List<ImageRating> ratings = ratingRepository.findByImage(img);
            double average = ratings.stream()
                    .mapToInt(ImageRating::getRating)
                    .average()
                    .orElse(0.0);
            img.setAverageRating(average);
        }

        return images;
    }

    // Get single image details (metadata + ratings)
    public PropertyImage getImageDetails(Long imageId) {
        PropertyImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        List<ImageRating> ratings = ratingRepository.findByImage(image);
        double average = ratings.stream().mapToInt(ImageRating::getRating).average().orElse(0.0);
        image.setAverageRating(average);

        return image;
    }

    // Rate image (user)
    public void rateImage(Long imageId, String userEmail, int ratingValue) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PropertyImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        Optional<ImageRating> existing = ratingRepository.findByImageAndUser(image, user);

        ImageRating rating = existing.orElseGet(ImageRating::new);
        rating.setImage(image);
        rating.setUser(user);
        rating.setRating(ratingValue);

        ratingRepository.save(rating);
    }

    //mOptional - For logging metadata (if required)
    public void saveImageMetadata(String fileName, String location, LocalDateTime uploadedAt, String userEmail) {
        User uploader = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PropertyImage image = new PropertyImage();
        image.setFileName(fileName);
        image.setLocation(location);
        image.setUploadedAt(uploadedAt);
        image.setUploadedBy(uploader);
        image.setApproved(false);

        imageRepository.save(image);
    }
}
