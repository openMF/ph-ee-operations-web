package org.apache.fineract.operations;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Date;

public interface CurrencyRateLockRepository extends CrudRepository<CurrencyRateLock, Long> {
    CurrencyRateLock findOneByUniqueKey(String uniqueKey);

    @Modifying
    @Query("delete from CurrencyRateLock c where c.expireBy=:timeStamp")
    void deleteBooks(@Param("timeStamp") Date timeStamp);
}
