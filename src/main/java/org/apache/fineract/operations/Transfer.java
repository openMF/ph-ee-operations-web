package org.apache.fineract.operations;


import org.apache.fineract.organisation.parent.AbstractPersistableCustom;
import org.eclipse.persistence.annotations.Index;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "transfers")
public class Transfer extends AbstractPersistableCustom<Long> {

    @Column(name = "WORKFLOW_INSTANCE_KEY")
    @Index(name = "idx_paymentProcessId")
    private Long workflowInstanceKey;

    @Column(name = "TRANSACTION_ID")
    private String transactionId;

    @Column(name = "STARTED_AT")
    private Date startedAt;
    @Column(name = "COMPLETED_AT")
    private Date completedAt;

    @Enumerated(EnumType.STRING)
    private TransferStatus status;

    @Column(name = "STATUS_DETAIL")
    private String statusDetail;

    @Column(name = "PAYEE_DFSP_ID")
    private String payeeDfspId;
    @Column(name = "PAYEE_PARTY_ID")
    private String payeePartyId;
    @Column(name = "PAYEE_PARTY_ID_TYPE")
    private String payeePartyIdType;
    @Column(name = "PAYEE_FEE")
    private BigDecimal payeeFee;
    @Column(name = "PAYEE_FEE_CURRENCY")
    private String payeeFeeCurrency;
    @Column(name = "PAYEE_QUOTE_CODE")
    private String payeeQuoteCode;

    @Column(name = "PAYER_DFSP_ID")
    private String payerDfspId;
    @Column(name = "PAYER_PARTY_ID")
    private String payerPartyId;
    @Column(name = "PAYER_PARTY_ID_TYPE")
    private String payerPartyIdType;
    @Column(name = "PAYER_FEE")
    private BigDecimal payerFee;
    @Column(name = "PAYER_FEE_CURRENCY")
    private String payerFeeCurrency;
    @Column(name = "PAYER_QUOTE_CODE")
    private String payerQuoteCode;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "currency")
    private String currency;

    @Column(name = "direction")
    private String direction;

    @Column(name = "error_information")
    private String errorInformation;

    @Column(name = "BATCH_ID")
    private String batchId;

    public Transfer() {
    }

    public Transfer(Long workflowInstanceKey) {
        this.workflowInstanceKey = workflowInstanceKey;
        this.status = TransferStatus.IN_PROGRESS;
    }

    public Date getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Date completedAt) {
        this.completedAt = completedAt;
    }

    public Date getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Date startedAt) {
        this.startedAt = startedAt;
    }

    public BigDecimal getPayeeFee() {
        return payeeFee;
    }

    public void setPayeeFee(BigDecimal payeeFee) {
        this.payeeFee = payeeFee;
    }

    public String getPayeeQuoteCode() {
        return payeeQuoteCode;
    }

    public void setPayeeQuoteCode(String payeeQuoteCode) {
        this.payeeQuoteCode = payeeQuoteCode;
    }

    public BigDecimal getPayerFee() {
        return payerFee;
    }

    public void setPayerFee(BigDecimal payerFee) {
        this.payerFee = payerFee;
    }

    public String getPayerQuoteCode() {
        return payerQuoteCode;
    }

    public void setPayerQuoteCode(String payerQuoteCode) {
        this.payerQuoteCode = payerQuoteCode;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Long getWorkflowInstanceKey() {
        return workflowInstanceKey;
    }

    public void setWorkflowInstanceKey(Long paymentProcessId) {
        this.workflowInstanceKey = paymentProcessId;
    }

    public TransferStatus getStatus() {
        return status;
    }

    public void setStatus(TransferStatus status) {
        this.status = status;
    }

    public String getPayeePartyId() {
        return payeePartyId;
    }

    public void setPayeePartyId(String payeePartyId) {
        this.payeePartyId = payeePartyId;
    }

    public String getPayeePartyIdType() {
        return payeePartyIdType;
    }

    public void setPayeePartyIdType(String payeePartyType) {
        this.payeePartyIdType = payeePartyType;
    }

    public String getPayerPartyId() {
        return payerPartyId;
    }

    public void setPayerPartyId(String payerPartyId) {
        this.payerPartyId = payerPartyId;
    }

    public String getPayerPartyIdType() {
        return payerPartyIdType;
    }

    public void setPayerPartyIdType(String payerPartyType) {
        this.payerPartyIdType = payerPartyType;
    }

    public String getPayeeFeeCurrency() {
        return payeeFeeCurrency;
    }

    public void setPayeeFeeCurrency(String payeeFeeCurrency) {
        this.payeeFeeCurrency = payeeFeeCurrency;
    }

    public String getPayerFeeCurrency() {
        return payerFeeCurrency;
    }

    public void setPayerFeeCurrency(String payerFeeCurrency) {
        this.payerFeeCurrency = payerFeeCurrency;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPayeeDfspId() {
        return payeeDfspId;
    }

    public void setPayeeDfspId(String payeeDfspId) {
        this.payeeDfspId = payeeDfspId;
    }

    public String getPayerDfspId() {
        return payerDfspId;
    }

    public void setPayerDfspId(String payerDfspId) {
        this.payerDfspId = payerDfspId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getStatusDetail() {
        return statusDetail;
    }

    public void setStatusDetail(String statusDetail) {
        this.statusDetail = statusDetail;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getErrorInformation() {
        return errorInformation;
    }

    public void setErrorInformation(String errorInformation) {
        this.errorInformation = errorInformation;
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }
}
