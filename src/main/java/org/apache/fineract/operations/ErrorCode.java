package org.apache.fineract.operations;

import org.apache.fineract.organisation.parent.AbstractPersistableCustom;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "errorcode")
public class ErrorCode extends AbstractPersistableCustom<Long> {

    @Column(name = "TRANSACTION_TYPE")
    String transactionType;

    @Column(name = "ERROR_MESSAGE")
    String errorMessage;

    @Column(name = "ERROR_CODE")
    String errorCode;

    @Column(name = "RECOVERABLE")
    boolean recoverable;

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public boolean isRecoverable() {
        return recoverable;
    }

    public void setRecoverable(boolean recoverable) {
        this.recoverable = recoverable;
    }
}
