package org.apache.fineract.operations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TransferRepository extends JpaRepository<Transfer, Long>, JpaSpecificationExecutor {

    Transfer findFirstByWorkflowInstanceKey(Long workflowInstanceKey);

}
