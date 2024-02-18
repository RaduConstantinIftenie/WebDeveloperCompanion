package com.wed.dao;

import com.wed.entity.UserFilterPreference;
import java.util.HashMap;
import java.util.Map;
import lombok.NoArgsConstructor;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

import static org.hibernate.cfg.AvailableSettings.DEFAULT_SCHEMA;
import static org.hibernate.cfg.AvailableSettings.DIALECT;
import static org.hibernate.cfg.AvailableSettings.DRIVER;
import static org.hibernate.cfg.AvailableSettings.PASS;
import static org.hibernate.cfg.AvailableSettings.URL;
import static org.hibernate.cfg.AvailableSettings.USER;
import static org.hibernate.cfg.SchemaToolingSettings.HBM2DDL_AUTO;
import static org.hibernate.cfg.SchemaToolingSettings.HBM2DDL_DATABASE_ACTION;

@NoArgsConstructor
public class RDSConfig {
    public static SessionFactory buildDaoSessionFactory() {
        Map<String, Object> settings = new HashMap<>();
        settings.put(DRIVER, "org.postgresql.Driver");
        settings.put(DIALECT, "org.hibernate.dialect.PostgreSQLDialect");
        settings.put(URL, getRdsUrl());
        settings.put(DEFAULT_SCHEMA, System.getenv("RDS_DB_SCHEMA_NAME"));
        settings.put(USER, System.getenv("RDS_USER"));
        settings.put(PASS, System.getenv("RDS_PWD"));
        settings.put("hibernate.hikari.connectionTimeout", "22000");
        settings.put("hibernate.hikari.idleTimeout", "32000");
        settings.put("hibernate.hikari.maximumPoolSize", "2");
        settings.put("hibernate.hikari.minimumIdle", "1");

        // Should be used only once, in the beginning, to automatically generate the database schema tables.
        // Afterwards, these 2 lines must be commented out.
        // settings.put(HBM2DDL_AUTO, "create-only");
        // settings.put(HBM2DDL_DATABASE_ACTION, "create");

        StandardServiceRegistry registry = new StandardServiceRegistryBuilder()
                .applySettings(settings)
                .build();

        return new MetadataSources(registry)
                .addAnnotatedClass(UserFilterPreference.class)
                .buildMetadata()
                .buildSessionFactory();
    }

    private static String getRdsUrl() {
        return "jdbc:postgresql://" + System.getenv("RDS_ENDPOINT") + ":" +
                System.getenv("RDS_PORT") + "/" + System.getenv("RDS_DB_NAME");
    }
}