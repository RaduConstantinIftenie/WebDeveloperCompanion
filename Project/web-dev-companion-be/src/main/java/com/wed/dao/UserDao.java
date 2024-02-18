package com.wed.dao;

import com.wed.entity.User;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class UserDao {
    /**
     * Persist the input user to the RDS.
     * @param daoSession Hibernate session used to persist the user.
     * @param user The user to persist.
     */
    public void persist(Session daoSession, User user) {
        Transaction tx = daoSession.beginTransaction();
        daoSession.save(user);
        tx.commit();
    }

    /**
     * Retrieve an user from the RDS by the user's identifier.
     * @param daoSession Hibernate session used to retrieve the user.
     * @param userId The identifier of the user to be retrieved.
     */
    public Optional<User> retrieve(Session daoSession, UUID userId) {
        return Optional.ofNullable(daoSession.get(User.class, userId));
    }
}