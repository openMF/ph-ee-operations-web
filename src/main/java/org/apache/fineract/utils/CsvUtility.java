package org.apache.fineract.utils;

import org.apache.fineract.exception.WriteToCsvException;
import org.apache.fineract.operations.TransactionRequest;

import javax.servlet.http.HttpServletResponse;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class CsvUtility {

    public static String[] transactionRequestsFields = {
            "workflowInstanceKey", "transactionId", "startedAt", "completedAt",
            "state", "payeeDfspId", "payeePartyId", "payeePartyIdType",
            "payeeFee", "payeeQuoteCode", "payerDfspId", "payerPartyId",
            "payerPartyIdType", "payerFee", "payerQuoteCode", "amount",
            "currency", "direction", "authType", "initiatorType", "scenario"};

    public static void writeToCsv(HttpServletResponse response, List<TransactionRequest> transactionRequests) throws WriteToCsvException {
        response.setContentType("text/csv");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String currentDateTime = dateFormatter.format(new Date());
        String filename = "transactionRequest_" + currentDateTime + ".csv";
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=" + filename;
        response.setHeader(headerKey, headerValue);

        CsvWriter<TransactionRequest> writer = new CsvWriter.Builder<TransactionRequest>()
                .setHeader(getCsvHeader(transactionRequestsFields))
                .setNameMapping(transactionRequestsFields)
                .setPrintWriter(response)
                .setData(transactionRequests)
                .build();

        writer.write();
    }

    /**
     * creates the csv header based on the fields provided
     * @return csv header of type String array
     */
    private static String[] getCsvHeader(String[] fields) {
        String[] csvHeader = new String[fields.length];
        for (int i = 0; i < fields.length; i++) {
            csvHeader[i] = fields[i].toUpperCase();
        }
        return csvHeader;
    }

}
