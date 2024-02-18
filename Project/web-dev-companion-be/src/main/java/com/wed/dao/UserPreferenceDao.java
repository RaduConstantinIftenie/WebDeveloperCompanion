package com.wed.dao;

import com.wed.entity.UserFilterPreference;
import java.util.*;
import org.hibernate.query.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class UserPreferenceDao {
    /**
     * Persist the input list of user filter preferences to the RDS.
     * @param daoSession Hibernate session used to persist the user filter preferences.
     * @param userFilterPreferences The user filter preferences list to persist.
     */
    public void persist(Session daoSession, Set<UserFilterPreference> userFilterPreferences) {
        Transaction tx = daoSession.beginTransaction();
        for (UserFilterPreference ufp: userFilterPreferences) {
            daoSession.save(ufp);
        }
        tx.commit();
    }

    /**
     * Retrieve from  RDS a list with all user filter preferences for the given user.
     * @param daoSession Hibernate session used to retrieve the user filter preferences.
     * @param userId The identifier of the user for which to retrieve the user filter preferences.
     */
    public Set<UserFilterPreference> retrieve(Session daoSession, UUID userId) {
        Transaction tx = daoSession.beginTransaction();
        Query<UserFilterPreference> query = daoSession
                .createQuery("FROM UserFilterPreference WHERE userId = :useridentifier", UserFilterPreference.class);
        query.setParameter("useridentifier", userId);
        List<UserFilterPreference> userFilterPreferences = query.getResultList();
        tx.commit();
        return new HashSet<>(userFilterPreferences);
    }

    /**
     * Delete the input list of user filter preferences from RDS.
     * @param daoSession Hibernate session used to delete the user filter preferences.
     * @param userFilterPreferences The user filter preferences list to delete.
     */
    public void delete(Session daoSession, List<UserFilterPreference> userFilterPreferences) {
        Transaction tx = daoSession.beginTransaction();
        for (UserFilterPreference ufp: userFilterPreferences) {
            daoSession.delete(ufp);
        }
        tx.commit();
    }

    /**
     * Update the input list of user filter preferences from RDS.
     * @param daoSession Hibernate session used to update the user filter preferences.
     * @param userFilterPreferences The user filter preferences list to update.
     */
    public void update(Session daoSession, Set<UserFilterPreference> userFilterPreferences) {
        Transaction tx = daoSession.beginTransaction();
        for (UserFilterPreference ufp: userFilterPreferences) {
            daoSession.update(ufp);
        }
        tx.commit();
    }
}