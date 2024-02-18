package com.wed.serverless;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.core.type.TypeReference;
import com.wed.dao.RDSConfig;
import com.wed.dao.UserPreferenceDao;
import com.wed.dto.ErrorResponseDto;
import com.wed.dto.FilterPreferencesDto;
import com.wed.entity.UserFilterPreference;
import com.wed.mapper.FilterPreferencesMapper;
import com.wed.mapper.FilterPreferencesMapperImpl;
import com.wed.service.UserService;
import com.wed.util.ResponseBuilder;
import com.zaxxer.hikari.HikariDataSource;
import java.util.*;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.SessionFactory;
import org.hibernate.engine.jdbc.connections.spi.ConnectionProvider;

import static org.apache.http.HttpStatus.*;

@Slf4j
public class UserFilterPreferencesHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
	private final SessionFactory daoSessionFactory = RDSConfig.buildDaoSessionFactory();
	private final UserService userService = new UserService(daoSessionFactory, new UserPreferenceDao());
	private final FilterPreferencesMapper filterPreferencesMapper = new FilterPreferencesMapperImpl();

	@Override
	public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
		APIGatewayProxyResponseEvent response;

		try {
            response = switch (input.getHttpMethod().toLowerCase(Locale.ENGLISH)) {
                case "get" -> handleGetRequest(input);
                case "delete" -> handleDeleteRequest(input);
                case "post" -> handlePostRequest(input);
                case "put" -> handlePutRequest(input);
                default -> handleUnsupportedRequest(input);
            };
		} catch (Exception e) {
			log.error("Failed to handle request {}", input, e);
			response = ResponseBuilder.buildResponse(SC_INTERNAL_SERVER_ERROR, new ErrorResponseDto(e.getMessage()));
		} finally {
			tearDownDaoConnectionPool();
		}

		return response;
	}

	private APIGatewayProxyResponseEvent handleGetRequest(APIGatewayProxyRequestEvent input) {
		UUID userId = UUID.fromString(input.getPathParameters().get("userId"));
		log.info("Received GET filter preferences request for user = {}", userId);

		APIGatewayProxyResponseEvent response;
		var ufps = userService.getFilterPreferencesForUser(userId);
		if (!ufps.isEmpty()) {
			response = ResponseBuilder.buildResponse(SC_OK,
					new FilterPreferencesDto(filterPreferencesMapper.fromUserFilterPreferencesList(ufps)));
		} else {
			response = ResponseBuilder.buildResponse(SC_NOT_FOUND, new ErrorResponseDto(
					String.format("No user filter preferences found for userId = %s", userId)));
		}

		return response;
	}

	private APIGatewayProxyResponseEvent handleDeleteRequest(APIGatewayProxyRequestEvent input) {
		UUID userId = UUID.fromString(input.getPathParameters().get("userId"));
		log.info("Received DELETE filter preferences request for user = {}", userId);

		APIGatewayProxyResponseEvent response;
		if (userService.existFilterPreferencesForUser(userId)) {
			TypeReference<Set<String>> tRef = new TypeReference<Set<String>>() {};
			Set<String> filterPreferencesToDelete = ResponseBuilder
					.fromJson(input.getQueryStringParameters().get("filters"), tRef);

			userService.deleteUserFilterPreferencesFromUser(filterPreferencesToDelete, userId);
			response = ResponseBuilder.buildResponse(SC_NO_CONTENT, null);
		} else {
			response = ResponseBuilder.buildResponse(SC_NOT_FOUND, new ErrorResponseDto(
					String.format("No user filter preferences found for userId = %s", userId)));
		}

		return response;
	}

	private APIGatewayProxyResponseEvent handlePostRequest(APIGatewayProxyRequestEvent input) {
		UUID userId = UUID.fromString(input.getPathParameters().get("userId"));
		log.info("Received POST filter preferences request for user = {}", userId);

		APIGatewayProxyResponseEvent response;
		FilterPreferencesDto filterPreferencesDto = ResponseBuilder
				.fromJson(input.getBody(), FilterPreferencesDto.class);

		if (filterPreferencesDto == null || filterPreferencesDto.getFilters() == null ||
				filterPreferencesDto.getFilters().isEmpty()) {
			return ResponseBuilder.buildResponse(SC_BAD_REQUEST, new ErrorResponseDto(
					String.format("Invalid input! No filter preferences provided in the request for user = %s", userId)));
		}
		Set<UserFilterPreference> userFilterPreferencesToAdd = filterPreferencesDto.getFilters()
				.stream()
				.map(filterPreferencesMapper::toUserFilterPreference)
				.collect(Collectors.toSet());

		userService.addFilterPreferencesToUser(userFilterPreferencesToAdd);
		var ufps = userService.getFilterPreferencesForUser(userId);
		response = ResponseBuilder.buildResponse(SC_OK,
				new FilterPreferencesDto(filterPreferencesMapper.fromUserFilterPreferencesList(ufps)));

		return response;
	}

	private APIGatewayProxyResponseEvent handlePutRequest(APIGatewayProxyRequestEvent input) {
		UUID userId = UUID.fromString(input.getPathParameters().get("userId"));
		log.info("Received PUT filter preferences request for user = {}", userId);

		APIGatewayProxyResponseEvent response;
		if (userService.existFilterPreferencesForUser(userId)) {
			FilterPreferencesDto filterPreferencesDto = ResponseBuilder
					.fromJson(input.getBody(), FilterPreferencesDto.class);

			if (filterPreferencesDto == null || filterPreferencesDto.getFilters() == null ||
					filterPreferencesDto.getFilters().isEmpty()) {
				return ResponseBuilder.buildResponse(SC_BAD_REQUEST, new ErrorResponseDto(
						String.format("Invalid input! No filter preferences provided in the request for user = %s", userId)));
			}
			Set<UserFilterPreference> userFilterPreferencesToUpdate = filterPreferencesDto.getFilters()
					.stream()
					.map(filterPreferencesMapper::toUserFilterPreference)
					.collect(Collectors.toSet());

			var ufps = userService.updateFilterPreferencesForUser(userFilterPreferencesToUpdate, userId);
			response = ResponseBuilder.buildResponse(SC_OK,
					new FilterPreferencesDto(filterPreferencesMapper.fromUserFilterPreferencesList(ufps)));
		} else {
			response = ResponseBuilder.buildResponse(SC_NOT_FOUND, new ErrorResponseDto(
					String.format("No user filter preferences found for userId = %s", userId)));
		}

		return response;
	}

	private APIGatewayProxyResponseEvent handleUnsupportedRequest(APIGatewayProxyRequestEvent input) {
		UUID userId = UUID.fromString(input.getPathParameters().get("userId"));
		log.info("Received unsupported filter preferences request for user = {}", userId);

		return ResponseBuilder.buildResponse(SC_BAD_REQUEST, new ErrorResponseDto(
				String.format("Received unsupported filter preferences request for user = %s", userId)));
	}

	private void tearDownDaoConnectionPool() {
		ConnectionProvider connectionProvider = daoSessionFactory
				.getSessionFactoryOptions()
				.getServiceRegistry()
				.getService(ConnectionProvider.class);

		HikariDataSource hikariDataSource = connectionProvider.unwrap(HikariDataSource.class);
		hikariDataSource.getHikariPoolMXBean().softEvictConnections();
	}
}