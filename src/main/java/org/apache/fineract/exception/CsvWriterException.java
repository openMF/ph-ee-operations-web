package org.apache.fineract.exception;

public class CsvWriterException extends WriteToCsvException{

    public CsvWriterException(ErrorCode errorCode, String errorDescription) {
        super(errorCode, errorDescription);
    }

}
