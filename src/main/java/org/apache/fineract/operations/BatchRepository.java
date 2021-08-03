package org.apache.fineract.operations;

import org.springframework.data.repository.CrudRepository;

public interface BatchRepository extends CrudRepository<Batch, Long> {

    Batch findByWorkflowInstanceKey(Long workflowInstanceKey);

    Batch findByBatchId(String batchId);

}
