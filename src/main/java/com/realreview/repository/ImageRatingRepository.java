package com.realreview.repository;

import com.realreview.entity.ImageRating;
import com.realreview.entity.PropertyImage;
import com.realreview.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRatingRepository extends JpaRepository<ImageRating, Long> {
    List<ImageRating> findByImage(PropertyImage image);

    Optional<ImageRating> findByImageAndUser(PropertyImage image, User user);
}

