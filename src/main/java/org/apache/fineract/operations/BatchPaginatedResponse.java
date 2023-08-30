package org.apache.fineract.operations;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BatchPaginatedResponse {

    long totalBatches, totalTransactions, totalAmount, totalApprovedCount, totalApprovedAmount, totalSubBatchesCreated;
    List<Batch> data;

    public void setTotalBatches(Long totalBatches) {
        if (totalBatches != null) {
            this.totalBatches = totalBatches;
        } else {
            this.totalBatches = 0;
        }
    }

    public void setTotalTransactions(Long totalTransactions) {
        if (totalTransactions != null) {
            this.totalTransactions = totalTransactions;
        } else {
            this.totalTransactions = 0;
        }
    }

    public void setTotalAmount(Long totalAmount) {
        if (totalAmount != null) {
            this.totalAmount = totalAmount;
        } else {
            this.totalAmount = 0;
        }
    }

    public void setTotalApprovedCount(Long totalApprovedCount) {
        if (totalApprovedCount != null) {
            this.totalApprovedCount = totalApprovedCount;
        } else {
            this.totalApprovedCount = 0;
        }
    }

    public void setTotalApprovedAmount(Long totalApprovedAmount) {
        if (totalApprovedAmount != null) {
            this.totalApprovedAmount = totalApprovedAmount;
        } else {
            this.totalApprovedAmount = 0;
        }
    }

    public void setTotalSubBatchesCreated(Long totalSubBatchesCreated) {
        if (totalSubBatchesCreated != null) {
            this.totalSubBatchesCreated = totalSubBatchesCreated;
        } else {
            this.totalSubBatchesCreated = 0;
        }
    }
}
