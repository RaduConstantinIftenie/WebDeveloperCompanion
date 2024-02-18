package com.wed.util;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

@UtilityClass
@Slf4j
public class ResponseBuilder {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public static <T> APIGatewayProxyResponseEvent buildResponse(Integer statusCode, T body) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
                .withHeaders(headers)
                .withStatusCode(statusCode);
        if (body != null) {
            response.withBody(toJson(body));
        }

        return response;
    }

    public static <T> String toJson(T object) {
        if (object != null) {
            try {
                return OBJECT_MAPPER.writeValueAsString(object);
            } catch (JsonProcessingException e) {
                log.error("Failed to serialize into JSON the object {}", object, e);
                return null;
            }
        }

        log.warn("Invalid input! The serialization cannot be done.");
        return null;
    }

    public static <T> T fromJson(String json, Class<T> type) {
        if (json != null && type != null) {
            try {
                return OBJECT_MAPPER.readValue(json, type);
            } catch (JsonProcessingException e) {
                log.error("Failed to deserialize to type {} the JSON string {}", type, json, e);
                return null;
            }
        }

        log.warn("Invalid input! The deserialization cannot be done.");
        return null;
    }

    public static <T> T fromJson(String json, TypeReference<T> typeRef) {
        if (json != null && typeRef != null) {
            try {
                return OBJECT_MAPPER.readValue(json, typeRef);
            } catch (JsonProcessingException e) {
                log.error("Failed to deserialize to type {} the JSON string {}", typeRef, json, e);
                return null;
            }
        }

        log.warn("Invalid input! The deserialization cannot be done.");
        return null;
    }
}