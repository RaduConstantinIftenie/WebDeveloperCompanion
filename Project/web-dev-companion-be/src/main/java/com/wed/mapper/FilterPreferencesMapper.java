package com.wed.mapper;

import com.wed.dto.FilterDto;
import com.wed.entity.UserFilterPreference;
import java.util.Set;
import org.mapstruct.Mapper;

@Mapper
public interface FilterPreferencesMapper {
    Set<FilterDto> fromUserFilterPreferencesList(Set<UserFilterPreference> userFilterPreferences);

    FilterDto fromUserFilterPreference(UserFilterPreference userFilterPreference);

    UserFilterPreference toUserFilterPreference(FilterDto customerDTO);
}