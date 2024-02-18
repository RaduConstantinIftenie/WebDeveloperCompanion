package com.wed.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.UUID;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "USER_FILTER_PREFERENCE")
@Data
@EqualsAndHashCode(callSuper = false)
public class UserFilterPreference extends BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Basic(optional = false)
    @Column(name = "ID")
    private UUID id;

    @Basic(optional = false)
    @Column(name = "USER_ID")
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    @Column(name = "TARGET")
    private UserFilterTarget target;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    @Column(name = "OPERATION_TYPE")
    private UserFilterOperationType operationType;

    @Basic(optional = false)
    @Column(name = "OPERATION_VALUE")
    private String operationValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "SORT_ORDER")
    private UserFilterSortOrder sortOrder;
}