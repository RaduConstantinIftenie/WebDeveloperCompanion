package com.wed.service;

import com.wed.dao.UserDao;
import com.wed.entity.User;
import com.wed.entity.UserFilterPreference;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

@AllArgsConstructor
public class UserService {
    private SessionFactory daoSessionFactory;
    private UserDao userDao;

    public Optional<User> getUserById(UUID userId) {
        if (userId != null) {
            try (Session session = daoSessionFactory.openSession()) {
                return userDao.retrieve(session, userId);
            }
        }

        return Optional.empty();
    }

    public boolean userExists(UUID userId) {
        if (userId != null) {
            try (Session session = daoSessionFactory.openSession()) {
                User user = userDao.retrieve(session, userId).orElse(null);
                return user != null;
            }
        }

        return false;
    }

    public void deleteFromUserFilterPreferences(UUID userId, Set<String> filterPreferencesToDelete) {
        if (userId != null) {
            try (Session session = daoSessionFactory.openSession()) {
                User user = userDao.retrieve(session, userId).orElse(null);
                if (user != null) {
                    Set<UserFilterPreference> userFilterPreferences = user.getUserFilterPreferences();
                    Set<UserFilterPreference> userFilterPreferencesToKeep = userFilterPreferences
                            .stream()
                            .filter(ufp -> !filterPreferencesToDelete.contains(ufp.getId().toString()))
                            .collect(Collectors.toSet());
                    userFilterPreferences.clear();
                    userFilterPreferences.addAll(userFilterPreferencesToKeep);
                    userDao.persist(session, user);
                }
            }
        }
    }

    public void addFilterPreferencesToUser(UUID userId, Set<UserFilterPreference> userFilterPreferencesToAdd) {
        if (userId != null) {
            try (Session session = daoSessionFactory.openSession()) {
                User user = userDao.retrieve(session, userId).orElse(null);
                if (user != null) {
                    Set<UserFilterPreference> userFilterPreferences = user.getUserFilterPreferences();
                    for (UserFilterPreference ufpToAdd: userFilterPreferencesToAdd) {
                        ufpToAdd.setUser(user);
                        userFilterPreferences.add(ufpToAdd);
                    }
                    userDao.persist(session, user);
                }
            }
        }
    }

    public Optional<User> updateFilterPreferencesForUser(UUID userId, Set<UserFilterPreference> userFilterPreferencesToUpdate) {
        if (userId != null) {
            try (Session session = daoSessionFactory.openSession()) {
                User user = userDao.retrieve(session, userId).orElse(null);
                if (user != null) {
                    Set<UserFilterPreference> userFilterPreferences = user.getUserFilterPreferences();
                    for (UserFilterPreference ufpToUpdate: userFilterPreferencesToUpdate) {
                        for (UserFilterPreference ufp: userFilterPreferences) {
                            if (ufp.getId().equals(ufpToUpdate.getId())) {
                                ufp.setTarget(ufpToUpdate.getTarget());
                                ufp.setOperationType(ufpToUpdate.getOperationType());
                                ufp.setOperationValue(ufpToUpdate.getOperationValue());
                                ufp.setSortOrder(ufpToUpdate.getSortOrder());
                                break;
                            }
                        }
                    }
                    userDao.persist(session, user);

                    return userDao.retrieve(session, userId);
                }
            }
        }

        return Optional.empty();
    }
}