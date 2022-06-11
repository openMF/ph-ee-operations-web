package org.apache.fineract.operations;



import org.apache.fineract.organisation.parent.AbstractPersistableCustom;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.Date;

import static org.apache.fineract.operations.TransactionRequestState.IN_PROGRESS;


@Entity
@Table(name = "transaction_requests")
public class TransactionRequest extends AbstractPersistableCustom<Long> {

    @Column(name = "WORKFLOW_INSTANCE_KEY")
    private Long workflowInstanceKey;

    @Column(name = "TRANSACTION_ID")
    private String transactionId;

    @Column(name = "STARTED_AT")
    private Date startedAt;

    @Column(name = "COMPLETED_AT")
    private Date completedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATE")
    private TransactionRequestState state;

    @Column(name = "PAYEE_DFSP_ID")
    private String payeeDfspId;
    @Column(name = "PAYEE_PARTY_ID")
    private String payeePartyId;
    @Column(name = "PAYEE_PARTY_ID_TYPE")
    private String payeePartyIdType;
    @Column(name = "PAYEE_FEE")
    private BigDecimal payeeFee;
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
    @Column(name = "PAYER_QUOTE_CODE")
    private String payerQuoteCode;

    @Column(name = "AMOUNT")
    private BigDecimal amount;

    @Column(name = "CURRENCY")
    private String currency;

    @Column(name = "DIRECTION")
    private String direction;

    @Column(name = "AUTH_TYPE")
    private String authType;

    @Column(name = "INITIATOR_TYPE")
    private String initiatorType;

    @Column(name = "SCENARIO")
    private String scenario;

    public TransactionRequest() {
    }

    public TransactionRequest(Long workflowInstanceKey) {
        this.workflowInstanceKey = workflowInstanceKey;
        this.state = IN_PROGRESS;
    }

    public Long getWorkflowInstanceKey() {
        return workflowInstanceKey;
    }

    public void setWorkflowInstanceKey(Long workflowInstanceKey) {
        this.workflowInstanceKey = workflowInstanceKey;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
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

    public TransactionRequestState getState() {
        return state;
    }

    public void setState(TransactionRequestState state) {
        this.state = state;
    }

    public String getPayeeDfspId() {
        return payeeDfspId;
    }

    public void setPayeeDfspId(String payeeDfspId) {
        this.payeeDfspId = payeeDfspId;
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

    public void setPayeePartyIdType(String payeePartyIdType) {
        this.payeePartyIdType = payeePartyIdType;
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

    public String getPayerDfspId() {
        return payerDfspId;
    }

    public void setPayerDfspId(String payerDfspId) {
        this.payerDfspId = payerDfspId;
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

    public void setPayerPartyIdType(String payerPartyIdType) {
        this.payerPartyIdType = payerPartyIdType;
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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getAuthType() {
        return authType;
    }

    public void setAuthType(String authType) {
        this.authType = authType;
    }

    public String getInitiatorType() {
        return initiatorType;
    }

    public void setInitiatorType(String initiatorType) {
        this.initiatorType = initiatorType;
    }

    public String getScenario() {
        return scenario;
    }

    public void setScenario(String scenario) {
        this.scenario = scenario;
    }
}
