package org.apache.fineract.operations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TransactionRequestRepository extends JpaRepository<TransactionRequest, Long>, JpaSpecificationExecutor {

    TransactionRequest findByWorkflowInstanceKey(Long workflowInstanceKey);

}
