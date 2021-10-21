package org.apache.fineract.operations;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ErrorCodeRepository extends CrudRepository<ErrorCode, Long> {

    @Query(value = "select e from ErrorCode e where e.errorCode = :code")
    List<ErrorCode> getErrorCodesByErrorCode(@Param("code") String code);

    @Query(value = "select e from ErrorCode e where e.recoverable = :recoverable")
    List<ErrorCode> getErrorCodesByRecoverable(@Param("recoverable") boolean code);

    @Query(value = "select e from ErrorCode e where e.transactionType = :transactionType")
    List<ErrorCode> getErrorCodesByTransactionType(@Param("transactionType") String transactionType);

}
