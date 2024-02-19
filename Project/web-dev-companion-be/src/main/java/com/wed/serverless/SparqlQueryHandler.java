package com.wed.serverless;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.wed.dao.NeptuneConfig;
import com.wed.dto.ErrorResponseDto;
import com.wed.dto.QueryRequestDto;
import com.wed.util.ResponseBuilder;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;

import static org.apache.hc.core5.http.HttpStatus.*;

@Slf4j
public class SparqlQueryHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        APIGatewayProxyResponseEvent response;

        try {
            QueryRequestDto queryRequestDto = ResponseBuilder
                    .fromJson(input.getBody(), QueryRequestDto.class);
            if (queryRequestDto == null || queryRequestDto.getUserId() == null ||
                    queryRequestDto.getQuery() == null) {
                return ResponseBuilder.buildResponse(SC_BAD_REQUEST, new ErrorResponseDto("Invalid input request!"));
            }
            log.info("Received POST query request from user = {}", queryRequestDto.getUserId());

            HttpPost httpPost = new HttpPost(NeptuneConfig.getNeptuneUrl());
            StringEntity queryStringEntity = new StringEntity(queryRequestDto.getQuery());
            httpPost.setEntity(queryStringEntity);
            httpPost.setHeader("Accept", "application/json");
            httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");

            try (CloseableHttpClient httpClient = HttpClients.createDefault();
                 CloseableHttpResponse httpResponse = httpClient.execute(httpPost)) {
                var statusCode = httpResponse.getCode();
                var reasonPhrase = httpResponse.getReasonPhrase();
                log.info("Received status code = {} and reason phrase = {} for SPARQL query = {} submission",
                        statusCode, reasonPhrase, queryRequestDto.getQuery());

                if (statusCode >= SC_OK && statusCode <= SC_NO_CONTENT) {
                    response = ResponseBuilder.buildResponse(SC_OK, null);
                    HttpEntity entity = httpResponse.getEntity();
                    if (entity != null) {
                        String result = EntityUtils.toString(entity);
                        log.info("The query results are = {}", result);
                        response.withBody(result);
                    }
                } else {
                    response = ResponseBuilder.buildResponse(SC_BAD_REQUEST, new ErrorResponseDto(reasonPhrase));
                }
            }
        } catch (Exception e) {
            log.error("Failed to handle request {}", input, e);
            response = ResponseBuilder.buildResponse(SC_INTERNAL_SERVER_ERROR, new ErrorResponseDto(e.getMessage()));
        }

        return response;
    }
}