package org.apache.fineract.operations;


import org.apache.fineract.organisation.parent.AbstractPersistableCustom;
import org.eclipse.persistence.annotations.Index;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "businesskeys")
public class BusinessKey extends AbstractPersistableCustom<Long> {

    @Column(name = "BUSINESS_KEY")
    @Index(name = "idx_businessKey")
    private String businessKey;

    @Column(name = "BUSINESS_KEY_TYPE")
    @Index(name = "idx_businessKeyType")
    private String businessKeyType;

    @Column(name = "WORKFLOW_INSTANCE_KEY")
    @Index(name = "idx_workflowInstanceKey")
    private Long workflowInstanceKey;

    @Column(name = "TIMESTAMP")
    private Long timestamp;

    public String getBusinessKeyType() {
        return businessKeyType;
    }

    public void setBusinessKeyType(String businessKeyType) {
        this.businessKeyType = businessKeyType;
    }

    public Long getWorkflowInstanceKey() {
        return workflowInstanceKey;
    }

    public void setWorkflowInstanceKey(Long workflowInstanceKey) {
        this.workflowInstanceKey = workflowInstanceKey;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String transactionId) {
        this.businessKey = transactionId;
    }
}
