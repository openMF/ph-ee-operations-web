package org.apache.fineract.utils;

import org.apache.fineract.data.ErrorCode;
import org.apache.fineract.exception.WriteToCsvException;

import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static org.apache.fineract.utils.CsvWriter.performErrorProneTask;

public class CsvUtility {

    public static <T> void writeToCsv(HttpServletResponse response, List<T> listOfData) throws WriteToCsvException {
        response.setContentType("text/csv");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String currentDateTime = dateFormatter.format(new Date());
        String filename = "transactionRequest_" + currentDateTime + ".csv";
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=" + filename;
        response.setHeader(headerKey, headerValue);

        PrintWriter printWriter = performErrorProneTask(
                new WriteToCsvException(
                        ErrorCode.CSV_GET_WRITER,
                        "Unable get writer from HttpServletResponse"),
                response::getWriter) ;

        //System.out.println("Print writer fetch success");

        CsvWriter<T> writer = new CsvWriter.Builder<T>()
                .setPrintWriter(printWriter)
                .setData(listOfData)
                .build();

        //System.out.println("Writer object created success");
        writer.write();
    }

}
