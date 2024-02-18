package com.wed.serverless;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.apache.http.HttpStatus.SC_BAD_REQUEST;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
@Slf4j
public class UserFilterPreferencesHandlerTest {
    @Test
    @Disabled
    public void testHandlePatchRequest() {
        APIGatewayProxyRequestEvent request = new APIGatewayProxyRequestEvent();
        request.setHttpMethod("PATCH");
        Map<String, String> pathParameters = new HashMap<>();
        String expectedUserId = UUID.randomUUID().toString();
        pathParameters.put("userId", expectedUserId);
        request.setPathParameters(pathParameters);
        Context context = Mockito.mock(Context.class);

        UserFilterPreferencesHandler lambdaFunction = new UserFilterPreferencesHandler();
        APIGatewayProxyResponseEvent response = lambdaFunction.handleRequest(request, context);

        assertEquals(SC_BAD_REQUEST, response.getStatusCode());
        assertEquals(String.format("{\"message\":\"Received unsupported filter preferences request for user = %s\"}", expectedUserId),
                response.getBody());
        log.info("Response StatusCode = {}", response.getStatusCode());
        log.info("Response Body = {}", response.getBody());
    }

    @Test
    @Disabled
    public void testHandleGetRequest() {
        APIGatewayProxyRequestEvent request = new APIGatewayProxyRequestEvent();
        request.setHttpMethod("GET");
        Map<String, String> pathParameters = new HashMap<>();
        // String expectedUserId = UUID.randomUUID().toString();
        String expectedUserId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        pathParameters.put("userId", expectedUserId);
        request.setPathParameters(pathParameters);
        Context context = Mockito.mock(Context.class);

        UserFilterPreferencesHandler lambdaFunction = new UserFilterPreferencesHandler();
        APIGatewayProxyResponseEvent response = lambdaFunction.handleRequest(request, context);

        log.info("Response StatusCode = {}", response.getStatusCode());
        log.info("Response Body = {}", response.getBody());
    }

    @Test
    @Disabled
    public void testHandlePostRequest() {
        APIGatewayProxyRequestEvent request = new APIGatewayProxyRequestEvent();
        request.setHttpMethod("POST");
        Map<String, String> pathParameters = new HashMap<>();
        String expectedUserId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        pathParameters.put("userId", expectedUserId);
        request.setPathParameters(pathParameters);
        String requestBody = """
                {
                  "filters": [
                    {
                      "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                      "target": "ID",
                      "operationType": "EQUALS",
                      "operationValue": "bf6368ee-64ac-41fd-b4e7-0e0caa652308",
                      "sortOrder": "ASC"
                    },
                	{
                	  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                      "target": "SOURCE",
                      "operationType": "CONTAINS",
                      "operationValue": "github",
                      "sortOrder": "ASC"
                    }
                  ]
                }
                """;
        request.setBody(requestBody);
        Context context = Mockito.mock(Context.class);

        UserFilterPreferencesHandler lambdaFunction = new UserFilterPreferencesHandler();
        APIGatewayProxyResponseEvent response = lambdaFunction.handleRequest(request, context);

        log.info("Response StatusCode = {}", response.getStatusCode());
        log.info("Response Body = {}", response.getBody());
    }

    @Test
    @Disabled
    public void testHandlePutRequest() {
        APIGatewayProxyRequestEvent request = new APIGatewayProxyRequestEvent();
        request.setHttpMethod("PUT");
        Map<String, String> pathParameters = new HashMap<>();
        String expectedUserId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        pathParameters.put("userId", expectedUserId);
        request.setPathParameters(pathParameters);
        String requestBody = """
                {
                  "filters": [
                    {
                      "id": "c0205a76-9a3b-480b-a572-b168fad95f6e",
                      "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                      "target": "ID",
                      "operationType": "EQUALS",
                      "operationValue": "bf6368ee-64ac-41fd-b4e7-0e0caa652308",
                      "sortOrder": "DESC"
                    },
                	{
                	  "id": "f64b13f8-8d3a-421d-93f9-f9f2de2ea741",
                	  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                      "target": "CREATOR",
                      "operationType": "CONTAINS",
                      "operationValue": "mdn web docs",
                      "sortOrder": "DESC"
                    }
                  ]
                }
                """;
        request.setBody(requestBody);
        Context context = Mockito.mock(Context.class);

        UserFilterPreferencesHandler lambdaFunction = new UserFilterPreferencesHandler();
        APIGatewayProxyResponseEvent response = lambdaFunction.handleRequest(request, context);

        log.info("Response StatusCode = {}", response.getStatusCode());
        log.info("Response Body = {}", response.getBody());
    }

    @Test
    @Disabled
    public void testHandleDeleteRequest() {
        APIGatewayProxyRequestEvent request = new APIGatewayProxyRequestEvent();
        request.setHttpMethod("DELETE");
        Map<String, String> pathParameters = new HashMap<>();
        String expectedUserId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        pathParameters.put("userId", expectedUserId);
        request.setPathParameters(pathParameters);
        Map<String, String> queryParameters = new HashMap<>();
        String ufpsToDelete = """
                ["c0205a76-9a3b-480b-a572-b168fad95f6e", "7b4ecb10-61c4-43a5-b69f-db9624b706be"]
                """;
        queryParameters.put("filters", ufpsToDelete);
        request.setQueryStringParameters(queryParameters);
        Context context = Mockito.mock(Context.class);

        UserFilterPreferencesHandler lambdaFunction = new UserFilterPreferencesHandler();
        APIGatewayProxyResponseEvent response = lambdaFunction.handleRequest(request, context);

        log.info("Response StatusCode = {}", response.getStatusCode());
        log.info("Response Body = {}", response.getBody());
    }
}