package com.realreview;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RealReviewApplication {

    public static void main(String[] args) {
        SpringApplication.run(RealReviewApplication.class, args);
    }
}
