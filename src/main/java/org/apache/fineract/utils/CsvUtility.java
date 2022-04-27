package org.apache.fineract.utils;

import org.apache.fineract.exception.WriteToCsvException;
import javax.servlet.http.HttpServletResponse;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class CsvUtility {

    public static <T> void writeToCsv(HttpServletResponse response, List<T> listOfData) throws WriteToCsvException {
        response.setContentType("text/csv");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String currentDateTime = dateFormatter.format(new Date());
        String filename = "transactionRequest_" + currentDateTime + ".csv";
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=" + filename;
        response.setHeader(headerKey, headerValue);

        CsvWriter<T> writer = new CsvWriter.Builder<T>()
                .setPrintWriter(response)
                .setData(listOfData)
                .build();

        writer.write();
    }

}
