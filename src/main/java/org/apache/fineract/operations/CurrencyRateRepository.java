package org.apache.fineract.operations;

import org.springframework.data.repository.CrudRepository;

public interface CurrencyRateRepository extends CrudRepository<CurrencyRate, Long> {

    CurrencyRate findOneByFromCurrencyAndToCurrency(String fromCurrency, String toCurrency);
}
