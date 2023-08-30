package org.apache.fineract.operations;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringEscapeUtils;
import org.mifos.connector.common.channel.dto.PhErrorDTO;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
public class TransferResponse {

    private int id;
    private Long workflowInstanceKey;

    private String transactionId;

    private Date startedAt;
    private Date completedAt;
    private TransferStatus status;
    private String statusDetail;
    private String payeeDfspId;
    private String payeePartyId;
    private String payeePartyIdType;
    private BigDecimal payeeFee;
    private String payeeFeeCurrency;
    private String payeeQuoteCode;
    private String payerDfspId;
    private String payerPartyId;
    private String payerPartyIdType;
    private BigDecimal payerFee;
    private String payerFeeCurrency;
    private String payerQuoteCode;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal amount;
    private String currency;
    private String direction;
    private PhErrorDTO errorInformation;
    private String batchId;
    private String clientCorrelationId;

    public void parseErrorInformation(String json, ObjectMapper mapper) throws IOException {
        try {
            this.errorInformation = mapper.readValue(json, PhErrorDTO.class);
        } catch (Exception e) {
            try {
                String formattedJson = StringEscapeUtils.unescapeJava(json);
                this.errorInformation = mapper.readValue(formattedJson, PhErrorDTO.class);
            } catch (Exception innerException) {
                this.errorInformation = null;
            }
        }
    }
}
