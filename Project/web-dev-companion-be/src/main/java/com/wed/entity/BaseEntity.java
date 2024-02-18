package com.wed.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@MappedSuperclass
@Data
public class BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @CreationTimestamp
    @Column(name = "CREATED_TS", nullable = false, updatable = false)
    private LocalDateTime createdTs;

    @UpdateTimestamp
    @Column(name = "UPDATED_TS", nullable = false)
    private LocalDateTime updatedTs;
}