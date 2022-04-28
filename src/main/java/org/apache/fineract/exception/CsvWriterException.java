package org.apache.fineract.exception;

import org.apache.fineract.data.ErrorCode;

public class CsvWriterException extends WriteToCsvException{

    public CsvWriterException(ErrorCode errorCode, String errorDescription) {
        super(errorCode, errorDescription);
    }

}
