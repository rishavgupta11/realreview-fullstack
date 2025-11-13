package com.realreview.entity;

import com.realreview.enums.ActionType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_actions")
public class AdminAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ActionType action;  // APPROVE or REJECT

    private LocalDateTime actionTime;

    @Column(length = 500)
    private String reason;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    @ManyToOne
    @JoinColumn(name = "image_id")
    private PropertyImage image;
}
