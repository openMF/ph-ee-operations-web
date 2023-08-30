package org.apache.fineract.data;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class IMUConversionData {
    private String lockKey;
    private String from;
    private String to;
    private Boolean failWhenExpired;
    private BigDecimal amount;
    private BigDecimal rate;
    private BigDecimal convertedAmount;
    private String errorCode;
    private String errorMessage;
    private Date expireBy;

    public IMUConversionData() {
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        if(amount != null)
            amount = amount.setScale(2, RoundingMode.HALF_UP);
        this.amount = amount;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        if(rate != null)
            rate = rate.setScale(2, RoundingMode.HALF_UP);
        this.rate = rate;
    }

    public BigDecimal getConvertedAmount() {
        return convertedAmount;
    }

    public void setConvertedAmount(BigDecimal convertedAmount) {
        if(convertedAmount != null)
            convertedAmount = convertedAmount.setScale(2, RoundingMode.HALF_UP);
        this.convertedAmount = convertedAmount;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getLockKey() {
        return lockKey;
    }

    public void setLockKey(String lockKey) {
        this.lockKey = lockKey;
    }

    public Boolean getFailWhenExpired() {
        return failWhenExpired;
    }

    public void setFailWhenExpired(Boolean failWhenExpired) {
        this.failWhenExpired = failWhenExpired;
    }

    public Date getExpireBy() {
        return expireBy;
    }

    public void setExpireBy(Date expireBy) {
        this.expireBy = expireBy;
    }
}
