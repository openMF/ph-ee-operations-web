package org.apache.fineract.utils;

import org.apache.fineract.operations.TransactionRequest;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class CsvUtility {

    public static void writeToCsv(HttpServletResponse response, List<TransactionRequest> transactionRequests) throws IOException {
        response.setContentType("text/csv");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String currentDateTime = dateFormatter.format(new Date());
        String filename = "transactionRequest_" + currentDateTime + ".csv";
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=" + filename;
        response.setHeader(headerKey, headerValue);

        ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
        String[] nameMapping = {
                "workflowInstanceKey", "transactionId", "startedAt", "completedAt",
                "state", "payeeDfspId", "payeePartyId", "payeePartyIdType",
                "payeeFee", "payeeQuoteCode", "payerDfspId", "payerPartyId",
                "payerPartyIdType", "payerFee", "payerQuoteCode", "amount",
                "currency", "direction", "authType", "initiatorType", "scenario"};
        String[] csvHeader = new String[nameMapping.length];
        for (int i = 0; i < nameMapping.length; i++) {
            csvHeader[i] = nameMapping[i].toUpperCase();
        }
        csvWriter.writeHeader(csvHeader);
        for (TransactionRequest user : transactionRequests) {
            csvWriter.write(user, nameMapping);
        }
        csvWriter.close();
    }

}
