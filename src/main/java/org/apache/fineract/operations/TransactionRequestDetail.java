package org.apache.fineract.operations;

import java.util.List;


public class TransactionRequestDetail {
    private TransactionRequest transactionRequest;
    private List<Task> tasks;
    private List<Variable> variables;

    public TransactionRequestDetail(TransactionRequest transactionRequest, List<Task> tasks, List<Variable> variables) {
        this.transactionRequest = transactionRequest;
        this.tasks = tasks;
        this.variables = variables;
    }

    public TransactionRequest getTransactionRequest() {
        return transactionRequest;
    }

    public void setTransactionRequest(TransactionRequest transactionRequest) {
        this.transactionRequest = transactionRequest;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public List<Variable> getVariables() {
        return variables;
    }

    public void setVariables(List<Variable> variables) {
        this.variables = variables;
    }
}
