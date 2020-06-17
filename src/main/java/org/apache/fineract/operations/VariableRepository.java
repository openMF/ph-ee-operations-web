package org.apache.fineract.operations;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface VariableRepository extends CrudRepository<Variable, Long> {

    List<Variable> findByWorkflowInstanceKeyOrderByTimestamp(Long workflowInstanceKey);

}
