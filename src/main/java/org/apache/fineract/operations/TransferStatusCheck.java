package org.apache.fineract.operations;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

public class TransferStatusCheck {


    @JsonProperty
    List<String> requestIds;
    @JsonProperty
    List<String>  payeePartyIds;

    public TransferStatusCheck() {
        super();
    }

    public List<String> getRequestIds() {
        return requestIds;
    }

    public void setRequestIds(List<String> requestIds) {
        this.requestIds = requestIds;
    }

    public List<String>  getPayeePartyIds() {
        return payeePartyIds;
    }

    public void setPayeePartyIds(List<String>  payeePartyIds) {
        this.payeePartyIds = payeePartyIds;
    }
}

