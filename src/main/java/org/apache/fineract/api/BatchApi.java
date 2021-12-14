package org.apache.fineract.api;

import org.apache.fineract.operations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class BatchApi {
    @Autowired
    private TransferRepository transferRepository;

    @Autowired
    private BatchRepository batchRepository;


    @GetMapping("/batch")
    public Batch batchDetails(@RequestParam String batchId, @RequestParam String requestId) {
        Batch batch = batchRepository.findByBatchId(batchId);
        if (batch != null) {
            if (batch.getResultGeneratedAt() != null) {
//                Checks if last status was checked before 10 mins
                if (new Date().getTime() - batch.getResultGeneratedAt().getTime() < 600000) {
                    return batch;
                } else {
                    return generateDetails(batch);
                }
            } else {
                return generateDetails(batch);
            }
        } else {
            return null;
        }

    }

    @GetMapping("/batch/transactions")
    public HashMap<String, String> batchTransactionDetails(@RequestParam String batchId) {
        Batch batch = batchRepository.findByBatchId(batchId);
        if (batch != null) {
            List<Transfer> transfers = transferRepository.findAllByBatchId(batch.getBatchId());
            HashMap<String, String> status = new HashMap<>();
            for(Transfer transfer: transfers){
                status.put(transfer.getTransactionId(), transfer.getStatus().name());
            }
            return status;
        } else {
            return null;
        }
    }

    private Batch generateDetails (Batch batch) {
//        TODO: Save this to CSV and upload to S3
        List<Transfer> transfers = transferRepository.findAllByBatchId(batch.getBatchId());
        Long completed = 0L;
        Long failed = 0L;
        for (Transfer transfer : transfers) {
            if (transfer.getStatus().equals(TransferStatus.COMPLETED)) {
                completed++;
            } else if (transfer.getStatus().equals(TransferStatus.FAILED)) {
                failed++;
            }
        }

        batch.setCompleted(completed);
        batch.setFailed(failed);
        batch.setResultGeneratedAt(new Date());
        batchRepository.save(batch);

        return batch;
    }

}
