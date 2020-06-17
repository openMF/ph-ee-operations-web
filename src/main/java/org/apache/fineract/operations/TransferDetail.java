package org.apache.fineract.operations;

import java.util.List;


public class TransferDetail {
    private Transfer transfer;
    private List<Task> tasks;
    private List<Variable> variables;

    public TransferDetail(Transfer transfer, List<Task> tasks, List<Variable> variables) {
        this.transfer = transfer;
        this.tasks = tasks;
        this.variables = variables;
    }

    public Transfer getTransfer() {
        return transfer;
    }

    public void setTransfer(Transfer transfer) {
        this.transfer = transfer;
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
