package com.realreview.entity;

import jakarta.persistence.*;

@Entity
public class ImageRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;

    @ManyToOne
    @JoinColumn(name = "image_id")
    private PropertyImage image;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters
    public Long getId() { return id; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public PropertyImage getImage() { return image; }
    public void setImage(PropertyImage image) { this.image = image; }

    public User getRatedBy() { return user; }
    public void setRatedBy(User ratedBy) { this.user = ratedBy; }

    public void setUser(User user) {
    }
}


