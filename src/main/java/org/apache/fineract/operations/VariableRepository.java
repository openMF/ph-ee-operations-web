package org.apache.fineract.operations;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VariableRepository extends CrudRepository<Variable, Long> {

    List<Variable> findByWorkflowInstanceKeyOrderByTimestamp(Long workflowInstanceKey);

    @Query("SELECT v from Variable v WHERE v.workflowInstanceKey=:workflowInstanceKey and v.name=:name")
    Optional<Variable> findByWorkflowInstanceKeyAndVariableName(@Param("name") String name,
                                                      @Param("workflowInstanceKey")  Long workflowInstanceKey);

}
