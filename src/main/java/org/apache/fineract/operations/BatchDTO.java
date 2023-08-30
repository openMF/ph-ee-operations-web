package org.apache.fineract.operations;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BatchDTO {

    private String batch_id;

    private String request_id;

    private Long total;

    private Long ongoing;

    private Long failed;

    private Long successful;

    private BigDecimal totalAmount;

    private BigDecimal successfulAmount;

    private BigDecimal pendingAmount;

    private BigDecimal failedAmount;

    private String file;

    private String notes;

    private String created_at;

    private String status;

    private String modes;

    private String purpose;

    private String failPercentage;

    private String successPercentage;

    private String registeringInstitutionId;

    private String payerFsp;

    private String correlationId;

    public BatchDTO(String batchId, String requestId, Long totalTransactions, Long ongoing, Long failed,
                    Long completed, BigDecimal total_amount, BigDecimal completed_amount, BigDecimal ongoing_amount,
                    BigDecimal failed_amount, String result_file, String note, String failPercentage,
                    String successPercentage, String registeringInstitutionId, String payerFsp, String correlationId) {
        this.batch_id = batchId;
        this.request_id = requestId;
        this.total = totalTransactions;
        this.ongoing = ongoing;
        this.failed = failed;
        this.successful = completed;
        this.totalAmount = total_amount;
        this.successfulAmount = completed_amount;
        this.pendingAmount = ongoing_amount;
        this.failedAmount = failed_amount;
        this.file = result_file;
        this.notes = note;
        this.failPercentage = failPercentage;
        this.successPercentage = successPercentage;
        this.registeringInstitutionId = registeringInstitutionId;
        this.payerFsp = payerFsp;
        this.correlationId = correlationId;
    }
}
