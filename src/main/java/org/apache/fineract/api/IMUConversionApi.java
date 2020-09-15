package org.apache.fineract.api;

import org.apache.fineract.data.IMUConversionData;
import org.apache.fineract.operations.CurrencyRate;
import org.apache.fineract.operations.CurrencyRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class IMUConversionApi {
    @Autowired
    private CurrencyRateRepository currencyRateRepository;

    @PostMapping(path = "/imuexchange/convert", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public IMUConversionData create(@RequestBody IMUConversionData imuConversion, HttpServletResponse response) {
        CurrencyRate exchange = currencyRateRepository.findOneByFromCurrencyAndToCurrency(imuConversion.getFrom(), imuConversion.getTo());
        if (exchange != null) {
            BigDecimal convertedAmount = exchange.getRate().multiply(imuConversion.getAmount());
            imuConversion.setRate(exchange.getRate());
            imuConversion.setConvertedAmount(convertedAmount);
        } else {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
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
        currencyRateRepository.save(currencyRates);
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

}

