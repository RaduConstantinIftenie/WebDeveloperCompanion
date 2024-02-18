package com.wed.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Set;
import java.util.UUID;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "USER")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class User extends BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Basic(optional = false)
    @Column(name = "ID")
    private UUID id;

    @Basic(optional = false)
    @Column(name = "FIRST_NAME")
    protected String firstName;

    @Basic(optional = false)
    @Column(name = "LAST_NAME")
    protected String lastName;

    @Column(name = "PHONE")
    protected String phone;

    @Basic(optional = false)
    @Column(name = "EMAIL")
    protected String email;

    @Basic(optional = false)
    @Column(name = "PASSWORD")
    protected String password;

    @EqualsAndHashCode.Exclude
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<UserFilterPreference> userFilterPreferences;
}