package com.wed.dto;

import com.wed.entity.UserFilterOperationType;
import com.wed.entity.UserFilterSortOrder;
import com.wed.entity.UserFilterTarget;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FilterDto {
    private UUID id;
    private UUID userId;
    private UserFilterTarget target;
    private UserFilterOperationType operationType;
    private String operationValue;
    private UserFilterSortOrder sortOrder;
}