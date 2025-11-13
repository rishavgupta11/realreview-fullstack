package com.realreview.repository;

import com.realreview.entity.PropertyImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
    Page<PropertyImage> findByApprovedTrue(Pageable pageable);
    Page<PropertyImage> findByLocationAndApprovedTrue(String location, Pageable pageable);

    // New method for admin dashboard
    List<PropertyImage> findByApprovedFalseOrderByUploadedAtDesc();

}
