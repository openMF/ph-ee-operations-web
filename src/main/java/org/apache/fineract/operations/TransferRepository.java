package org.apache.fineract.operations;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface TransferRepository extends JpaRepository<Transfer, Long>, JpaSpecificationExecutor {

    Transfer findFirstByWorkflowInstanceKey(Long workflowInstanceKey);

    Transfer findFirstByTransactionIdAndDirection(String transactionId, String direction);

    List<Transfer> findAllByBatchId(String batchId);

    List<Transfer> findAllByBatchIdAndStatus(String batchId, String status, Pageable pageable);

    List<Transfer> findAllByBatchId(String batchId, Pageable pageable);

}
