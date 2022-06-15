package org.apache.fineract.operations;


import org.apache.fineract.organisation.parent.AbstractPersistableCustom;
import org.eclipse.persistence.annotations.Index;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

@Entity
@Table(name = "variables")
public class Variable extends AbstractPersistableCustom<Long> {

    @Column(name = "WORKFLOW_KEY")
    private Long workflowKey;

    @Column(name = "WORKFLOW_INSTANCE_KEY")
    @Index(name = "idx_workflowInstanceKey")
    private String workflowInstanceKey;

    @Column(name = "TIMESTAMP")
    private Long timestamp;

    @Column(name = "NAME")
    private String name;

    @Lob
    @Column(name = "VALUE")
    private String value;

    public Long getWorkflowKey() {
        return workflowKey;
    }

    public void setWorkflowKey(Long workflowKey) {
        this.workflowKey = workflowKey;
    }

    public String getWorkflowInstanceKey() {
        return workflowInstanceKey;
    }

    public void setWorkflowInstanceKey(String workflowInstanceKey) {
        this.workflowInstanceKey = workflowInstanceKey;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
