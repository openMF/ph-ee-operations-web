package org.apache.fineract.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.fineract.data.IMUConversionData;
import org.apache.fineract.operations.CurrencyRate;
import org.apache.fineract.operations.CurrencyRateLock;
import org.apache.fineract.operations.CurrencyRateLockRepository;
import org.apache.fineract.operations.CurrencyRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.util.*;

@RestController
@SecurityRequirement(name = "auth")
@RequestMapping("/api/v1")
public class IMUConversionApi {
    @Autowired
    private CurrencyRateRepository currencyRateRepository;

    @Autowired
    private CurrencyRateLockRepository currencyRateLockRepository;

    @Value("${config.imu.rate-validity-seconds}")
    private Integer imuRateValidSeconds;

    @PostMapping(path = "/imuexchange/preview", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public IMUConversionData create(@RequestBody IMUConversionData imuConversion, HttpServletResponse response) {
        Date currentDate = new Date();
        Date expireBy = this.getExpireBy(currentDate);
        BigDecimal rate = null;
        String uniqueKey = null;
        if(imuConversion.getLockKey() != null){
            CurrencyRateLock lockedRate = currencyRateLockRepository.findOneByUniqueKey(imuConversion.getLockKey());
            if(lockedRate == null){
                uniqueKey = imuConversion.getLockKey();
            }else if(!lockedRate.isExpiredAtDate(currentDate)){//??
                rate = lockedRate.getRate();
                if(!imuConversion.getFailWhenExpired()){
                    lockedRate.setExpireBy(expireBy);
                    currencyRateLockRepository.save(lockedRate);
                }
                imuConversion.setExpireBy(lockedRate.getExpireBy());
            }else if(imuConversion.getFailWhenExpired()){
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                imuConversion.setErrorCode("002");
                imuConversion.setErrorMessage("Conversion Rate Expired!");
                return imuConversion;
            }
        }
        if(rate == null){
            CurrencyRate exchange = currencyRateRepository.findOneByFromCurrencyAndToCurrency(imuConversion.getFrom(), imuConversion.getTo());
            if (exchange != null) {
                rate = exchange.getRate();
                if(uniqueKey == null){
                    uniqueKey = UUID.randomUUID().toString();
                }
                CurrencyRateLock lockedRate = exchange.getLock(uniqueKey, expireBy);
                currencyRateLockRepository.save(lockedRate);
                imuConversion.setLockKey(uniqueKey);
                imuConversion.setExpireBy(expireBy);
            }
        }
        if(rate != null){
            BigDecimal convertedAmount = rate.multiply(imuConversion.getAmount());
            imuConversion.setRate(rate);
            imuConversion.setConvertedAmount(convertedAmount);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            imuConversion.setErrorCode("001");
            imuConversion.setErrorMessage("Master data not found");
        }
        return imuConversion;
    }

    @PostMapping(path = "/imuexchange/master", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void create(@RequestBody List<IMUConversionData> exchangeRates, HttpServletResponse response) {

        List<CurrencyRate> currencyRates = new ArrayList<>();

        Date currentDate =  new Date();
        for(IMUConversionData exchangeRate : exchangeRates){
            CurrencyRate exchange = currencyRateRepository.findOneByFromCurrencyAndToCurrency(exchangeRate.getFrom(), exchangeRate.getTo());

            if(exchange != null){
                exchange.setRate(exchangeRate.getRate());
                exchange.setLastUpdated(currentDate);
            }else{
                exchange = new CurrencyRate(exchangeRate.getFrom(), exchangeRate.getTo(), exchangeRate.getRate(), currentDate);
            }
            currencyRates.add(exchange);
        }
        currencyRateRepository.saveAll(currencyRates);
    }

    @DeleteMapping(path = "/imuexchange/master", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void delete(@RequestBody IMUConversionData imuConversion, HttpServletResponse response) {
        CurrencyRate exchange = currencyRateRepository.findOneByFromCurrencyAndToCurrency(imuConversion.getFrom(), imuConversion.getTo());
        if (exchange != null) {
            currencyRateRepository.delete(exchange);
        } else {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            imuConversion.setErrorCode("001");
            imuConversion.setErrorMessage("Master data not found");
        }
    }

    private Date getExpireBy(Date curDate){
        Calendar gcal = new GregorianCalendar();
        gcal.setTime(curDate);
        gcal.add(Calendar.SECOND, imuRateValidSeconds);
       return gcal.getTime();
    }

}

