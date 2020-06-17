package org.apache.fineract.api;


import org.apache.fineract.operations.BusinessKey;
import org.apache.fineract.operations.BusinessKeyRepository;
import org.apache.fineract.operations.Task;
import org.apache.fineract.operations.TaskRepository;
import org.apache.fineract.operations.Transfer;
import org.apache.fineract.operations.TransferDetail;
import org.apache.fineract.operations.TransferRepository;
import org.apache.fineract.operations.Variable;
import org.apache.fineract.operations.VariableRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class OperationsApi {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private BusinessKeyRepository businessKeyRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private VariableRepository variableRepository;

    @Autowired
    private TransferRepository transferRepository;

    @GetMapping("/transaction/{workflowInstanceKey}")
    public TransferDetail transaction(@PathVariable Long workflowInstanceKey) {
        Transfer transfer = transferRepository.findFirstByWorkflowInstanceKey(workflowInstanceKey);
        List<Task> tasks = taskRepository.findByWorkflowInstanceKeyOrderByTimestamp(workflowInstanceKey);
        List<Variable> variables = variableRepository.findByWorkflowInstanceKeyOrderByTimestamp(workflowInstanceKey);
        return new TransferDetail(transfer, tasks, variables);
    }

    @GetMapping("/variables")
    public List<List<Variable>> variables(
            @RequestParam(value = "businessKey") String businessKey,
            @RequestParam(value = "businessKeyType") String businessKeyType
    ) {
        return loadTransfers(businessKey, businessKeyType).stream()
                .map(transfer -> variableRepository.findByWorkflowInstanceKeyOrderByTimestamp(transfer.getWorkflowInstanceKey()))
                .collect(Collectors.toList());
    }

    @GetMapping("/tasks")
    public List<List<Task>> tasks(
            @RequestParam(value = "businessKey") String businessKey,
            @RequestParam(value = "businessKeyType") String businessKeyType
    ) {
        return loadTransfers(businessKey, businessKeyType).stream()
                .map(transfer -> taskRepository.findByWorkflowInstanceKeyOrderByTimestamp(transfer.getWorkflowInstanceKey()))
                .collect(Collectors.toList());
    }

    private List<BusinessKey> loadTransfers(@RequestParam("businessKey") String
                                                       businessKey, @RequestParam("businessKeyType") String businessKeyType) {
        List<BusinessKey> businessKeys = businessKeyRepository.findByBusinessKeyAndBusinessKeyType(businessKey, businessKeyType);
        logger.debug("loaded {} transfer(s) for business key {} of type {}", businessKeys.size(), businessKey, businessKeyType);
        return businessKeys;
    }
}