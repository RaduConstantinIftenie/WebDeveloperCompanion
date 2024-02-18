package com.wed.mapper;

import com.wed.dto.FilterDto;
import com.wed.dto.FilterPreferencesDto;
import com.wed.entity.User;
import com.wed.entity.UserFilterPreference;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper
public interface FilterPreferencesMapper {
    @Mapping(target = "filters", source = "user.userFilterPreferences")
    FilterPreferencesDto fromUser(User user);

    @Mapping(target = "id", ignore = true)
    FilterDto fromUserFilterPreference(UserFilterPreference userFilterPreference);

    @AfterMapping
    default void enrichWithUserId(UserFilterPreference userFilterPreference, @MappingTarget FilterDto filterDto) {
        filterDto.setId(userFilterPreference.getUser().getId());
    }

    @Mapping(target = "user", ignore = true)
    UserFilterPreference toUserFilterPreference(FilterDto customerDTO);
}