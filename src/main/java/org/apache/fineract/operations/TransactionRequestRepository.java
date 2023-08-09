package org.apache.fineract.operations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRequestRepository extends JpaRepository<TransactionRequest, Long>, JpaSpecificationExecutor {

    TransactionRequest findFirstByWorkflowInstanceKey(Long workflowInstanceKey);

//    @Deprecated(forRemoval = true)
    @Query("SELECT tr FROM TransactionRequest tr INNER JOIN Variable v ON tr.workflowInstanceKey = v.workflowInstanceKey" +
            " WHERE v.name=\"errorDescription\" and v.value IN :errorDescription")
    List<TransactionRequest> filterByErrorDescription(@Param("errorDescription") List<String> errorDescription);

}
