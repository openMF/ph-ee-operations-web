package org.apache.fineract.operations;


import org.apache.fineract.organisation.parent.AbstractPersistableCustom;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tasks")
public class Task extends AbstractPersistableCustom<Long> {

    @Column(name = "WORKFLOW_KEY")
    private Long workflowKey;
    @Column(name = "WORKFLOW_INSTANCE_KEY")
    private Long workflowInstanceKey;
    @Column(name = "TIMESTAMP")
    private Long timestamp;
    @Column(name = "INTENT")
    private String intent;
    @Column(name = "RECORD_TYPE")
    private String recordType;
    @Column(name = "TYPE")
    private String type;
    @Column(name = "ELEMENT_ID")
    private String elementId;

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Long getWorkflowKey() {
        return workflowKey;
    }

    public void setWorkflowKey(Long workflowKey) {
        this.workflowKey = workflowKey;
    }

    public Long getWorkflowInstanceKey() {
        return workflowInstanceKey;
    }

    public void setWorkflowInstanceKey(Long workflowInstanceKey) {
        this.workflowInstanceKey = workflowInstanceKey;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getRecordType() {
        return recordType;
    }

    public void setRecordType(String recordType) {
        this.recordType = recordType;
    }

    public String getType() {
        return type;
    }

    public String getElementId() {
        return elementId;
    }

    public void setElementId(String elementId) {
        this.elementId = elementId;
    }

    public void setType(String type) {
        this.type = type;
    }
}
