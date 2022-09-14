package org.apache.fineract.operations;

import java.math.BigDecimal;
import java.util.Date;

public class BatchDTO {

    private String batch_id;

    private String request_id;

    private Long total;

    private Long ongoing;

    private Long failed;

    private Long successful;

    private BigDecimal totalAmount;

    private BigDecimal successfulAmount;

    private BigDecimal pendingAmount;

    private BigDecimal failedAmount;

    private String file;

    private String notes;

    private String created_at;

    private String status;

    private String modes;

    private String purpose;

    public BatchDTO(String batchId, String requestId, Long totalTransactions, Long ongoing, Long failed, Long completed, BigDecimal total_amount, BigDecimal completed_amount, BigDecimal ongoing_amount, BigDecimal failed_amount, String result_file, String note) {
        this.batch_id = batchId;
        this.request_id = requestId;
        this.total = totalTransactions;
        this.ongoing = ongoing;
        this.failed = failed;
        this.successful = completed;
        this.totalAmount = total_amount;
        this.successfulAmount = completed_amount;
        this.pendingAmount = ongoing_amount;
        this.failedAmount = failed_amount;
        this.file = result_file;
        this.notes = note;
    }

    public BatchDTO(String batch_id, String request_id, Long total, Long ongoing, Long failed, Long successful, BigDecimal totalAmount, BigDecimal successfulAmount, BigDecimal pendingAmount, BigDecimal failedAmount, String file, String notes, String created_at, String status, String modes, String purpose) {
        this.batch_id = batch_id;
        this.request_id = request_id;
        this.total = total;
        this.ongoing = ongoing;
        this.failed = failed;
        this.successful = successful;
        this.totalAmount = totalAmount;
        this.successfulAmount = successfulAmount;
        this.pendingAmount = pendingAmount;
        this.failedAmount = failedAmount;
        this.file = file;
        this.notes = notes;
        this.created_at = created_at;
        this.status = status;
        this.modes = modes;
        this.purpose = purpose;
    }

    public String getBatch_id() {
        return batch_id;
    }

    public void setBatch_id(String batch_id) {
        this.batch_id = batch_id;
    }

    public String getRequest_id() {
        return request_id;
    }

    public void setRequest_id(String request_id) {
        this.request_id = request_id;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
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

    public Long getSuccessful() {
        return successful;
    }

    public void setSuccessful(Long successful) {
        this.successful = successful;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getSuccessfulAmount() {
        return successfulAmount;
    }

    public void setSuccessfulAmount(BigDecimal successfulAmount) {
        this.successfulAmount = successfulAmount;
    }

    public BigDecimal getPendingAmount() {
        return pendingAmount;
    }

    public void setPendingAmount(BigDecimal pendingAmount) {
        this.pendingAmount = pendingAmount;
    }

    public BigDecimal getFailedAmount() {
        return failedAmount;
    }

    public void setFailedAmount(BigDecimal failedAmount) {
        this.failedAmount = failedAmount;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getModes() {
        return modes;
    }

    public void setModes(String modes) {
        this.modes = modes;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
}
