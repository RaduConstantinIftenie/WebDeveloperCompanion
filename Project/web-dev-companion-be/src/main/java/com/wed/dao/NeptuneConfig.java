package com.wed.dao;

import lombok.experimental.UtilityClass;

@UtilityClass
public class NeptuneConfig {
    public static String getNeptuneUrl() {
        return "https://" + System.getenv("NEPTUNE_ENDPOINT") + ":" + System.getenv("NEPTUNE_PORT") + "/sparql";
    }
}