package org.apache.fineract.api;

import java.util.List;

public class EntityAssignments {

    private List<Long> entityIds;

    public EntityAssignments() {
    }

    public List<Long> getEntityIds() {
        return entityIds;
    }

    public void setEntityIds(List<Long> entityIds) {
        this.entityIds = entityIds;
    }
}
