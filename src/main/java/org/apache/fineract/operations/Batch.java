package org.apache.fineract.operations;

import org.eclipse.persistence.annotations.Index;
import org.apache.fineract.organisation.parent.AbstractPersistableCustom;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "batches")
public class Batch extends AbstractPersistableCustom<Long> {

    @Column(name = "BATCH_ID")
    private String batchId;

    @Column(name = "SUB_BATCH_ID")
    private String subBatchId;

    @Column(name = "REQUEST_ID")
    private String requestId;

    @Column(name = "REQUEST_FILE")
    private String requestFile;

    @Column(name = "TOTAL_TRANSACTIONS")
    private Long totalTransactions;

    @Column(name = "ONGOING")
    private Long ongoing;

    @Column(name = "FAILED")
    private Long failed;

    @Column(name = "COMPLETED")
    private Long completed;

    @Column(name = "TOTAL_AMOUNT")
    private Long totalAmount;

    @Column(name = "ONGOING_AMOUNT")
    private Long ongoingAmount;

    @Column(name = "FAILED_AMOUNT")
    private Long failedAmount;

    @Column(name = "COMPLETED_AMOUNT")
    private Long completedAmount;

    @Column(name = "RESULT_FILE")
    private String result_file;

    @Column(name = "RESULT_GENERATED_AT")
    private Date resultGeneratedAt;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "WORKFLOW_KEY")
    private Long workflowKey;

    @Column(name = "WORKFLOW_INSTANCE_KEY")
    @Index(name = "idx_batches_key")
    private Long workflowInstanceKey;

    @Column(name = "STARTED_AT")
    private Date startedAt;

    @Column(name = "COMPLETED_AT")
    private Date completedAt;

    @Column(name = "PAYMENT_MODE")
    private String paymentMode;

    public Batch() {
    }

    public Batch(Long workflowInstanceKey) {
        this.workflowInstanceKey = workflowInstanceKey;
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getRequestFile() {
        return requestFile;
    }

    public void setRequestFile(String requestFile) {
        this.requestFile = requestFile;
    }

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public Long getOngoing() {
        return ongoing;
    }

    public void setOngoing(Long ongoing) {
        this.ongoing = ongoing;
    }

    public Long getFailed() {
        return failed;
    }

    public void setFailed(Long failed) {
        this.failed = failed;
    }

    public Long getCompleted() {
        return completed;
    }

    public void setCompleted(Long completed) {
        this.completed = completed;
    }

    public String getResult_file() {
        return result_file;
    }

    public void setResult_file(String result_file) {
        this.result_file = result_file;
    }

    public Date getResultGeneratedAt() {
        return resultGeneratedAt;
    }

    public void setResultGeneratedAt(Date resultGeneratedAt) {
        this.resultGeneratedAt = resultGeneratedAt;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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

    public Date getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Date startedAt) {
        this.startedAt = startedAt;
    }

    public Date getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Date completedAt) {
        this.completedAt = completedAt;
    }

    public String getSubBatchId() {
        return subBatchId;
    }

    public void setSubBatchId(String subBatchId) {
        this.subBatchId = subBatchId;
    }

    public Long getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Long totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getOngoingAmount() {
        return ongoingAmount;
    }

    public void setOngoingAmount(Long ongoingAmount) {
        this.ongoingAmount = ongoingAmount;
    }

    public Long getFailedAmount() {
        return failedAmount;
    }

    public void setFailedAmount(Long failedAmount) {
        this.failedAmount = failedAmount;
    }

    public Long getCompletedAmount() {
        return completedAmount;
    }

    public void setCompletedAmount(Long completedAmount) {
        this.completedAmount = completedAmount;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String mode) {
        this.paymentMode = mode;
    }
}

