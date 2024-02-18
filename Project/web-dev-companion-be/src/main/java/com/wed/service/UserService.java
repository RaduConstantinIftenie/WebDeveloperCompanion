package com.wed.service;

import com.wed.dao.UserPreferenceDao;
import com.wed.entity.UserFilterPreference;
import java.util.*;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

@AllArgsConstructor
public class UserService {
    private SessionFactory daoSessionFactory;
    private UserPreferenceDao userPreferenceDao;

    public Set<UserFilterPreference> getFilterPreferencesForUser(UUID userId) {
        if (userId != null) {
            try (Session session = daoSessionFactory.openSession()) {
                var ufps = userPreferenceDao.retrieve(session, userId);
                return ufps != null ? ufps : new HashSet<>();
            }
        }

        return new HashSet<>();
    }

    public boolean existFilterPreferencesForUser(UUID userId) {
        if (userId != null) {
            try (Session session = daoSessionFactory.openSession()) {
                var ufps = userPreferenceDao.retrieve(session, userId);
                return (ufps != null) && !ufps.isEmpty();
            }
        }

        return false;
    }

    public void deleteUserFilterPreferencesFromUser(Set<String> filterPreferencesToDelete, UUID userId) {
        try (Session session = daoSessionFactory.openSession()) {
            var ufps = userPreferenceDao.retrieve(session, userId);
            List<UserFilterPreference> userFilterPreferencesToDelete = ufps
                    .stream()
                    .filter(ufp -> filterPreferencesToDelete.contains(ufp.getId().toString()))
                    .collect(Collectors.toList());
            userPreferenceDao.delete(session, userFilterPreferencesToDelete);
        }
    }

    public void addFilterPreferencesToUser(Set<UserFilterPreference> userFilterPreferencesToAdd) {
        try (Session session = daoSessionFactory.openSession()) {
            userPreferenceDao.persist(session, userFilterPreferencesToAdd);
        }
    }

    public Set<UserFilterPreference> updateFilterPreferencesForUser(
            Set<UserFilterPreference> userFilterPreferencesToUpdate, UUID userId) {
        if (userId != null) {
            try (Session session = daoSessionFactory.openSession()) {
                var ufps = userPreferenceDao.retrieve(session, userId);
                for (UserFilterPreference ufpToUpdate : userFilterPreferencesToUpdate) {
                    for (UserFilterPreference ufp : ufps) {
                        if (ufp.getId().equals(ufpToUpdate.getId())) {
                            ufp.setTarget(ufpToUpdate.getTarget());
                            ufp.setOperationType(ufpToUpdate.getOperationType());
                            ufp.setOperationValue(ufpToUpdate.getOperationValue());
                            ufp.setSortOrder(ufpToUpdate.getSortOrder());
                            break;
                        }
                    }
                }
                userPreferenceDao.update(session, ufps);
                return userPreferenceDao.retrieve(session, userId);
            }
        }

        return new HashSet<>();
    }
}