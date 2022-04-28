package org.apache.fineract.exception;

import org.apache.fineract.data.ErrorCode;

public class WriteToCsvException extends Exception {

    private String developerMessage;
    private final String errorDescription;
    private final ErrorCode errorCode;

    public WriteToCsvException(ErrorCode errorCode, String errorDescription, String developerMessage) {
        super(developerMessage);
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.developerMessage = developerMessage;
    }

    public WriteToCsvException(ErrorCode errorCode, String errorDescription) {
        super(errorDescription);
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.developerMessage = errorDescription;
    }

    public void setDeveloperMessage(String developerMessage) {
        this.developerMessage = developerMessage;
    }

    public String getErrorCode() {
        return errorCode.name();
    }

    public String getErrorDescription() {
        return errorDescription;
    }

    public String getDeveloperMessage() { return developerMessage; }

    @Override
    public String toString() {
        return "{" +
                "developerMessage='" + developerMessage + '\'' +
                ", errorDescription='" + errorDescription + '\'' +
                ", errorCode=" + errorCode +
                '}';
    }

}
