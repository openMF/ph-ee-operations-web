package org.apache.fineract.operations;

import org.apache.fineract.organisation.parent.AbstractPersistableCustom;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "m_currency_rates_lock")
public class CurrencyRateLock  extends AbstractPersistableCustom<Long> {

    @Column(name = "unique_key")
    private String uniqueKey;

    @Column(name = "from_currency")
    private String fromCurrency;

    @Column(name = "to_currency")
    private String toCurrency;

    @Column(name = "rate")
    private BigDecimal rate;

    @Column(name = "expire_by")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expireBy;

    public CurrencyRateLock() {
    }

    public CurrencyRateLock(String uniqueKey, String fromCurrency, String toCurrency, BigDecimal rate, Date expireBy) {
        this.uniqueKey = uniqueKey;
        this.fromCurrency = fromCurrency;
        this.toCurrency = toCurrency;
        this.rate = rate;
        this.expireBy = expireBy;
    }

    public boolean isExpiredAtDate(Date date){
        return expireBy.before(date);
    }

    public BigDecimal getRate() {
        return rate;
    }

    public Date getExpireBy() {
        return expireBy;
    }

    public void setExpireBy(Date expireBy) {
        this.expireBy = expireBy;
    }
}
