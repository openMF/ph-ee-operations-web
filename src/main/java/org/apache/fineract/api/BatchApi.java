package org.apache.fineract.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.apache.fineract.config.PaymentModeConfiguration;
import org.apache.fineract.file.FileTransferService;
import org.apache.fineract.operations.Batch;
import org.apache.fineract.operations.BatchDTO;
import org.apache.fineract.operations.BatchPaginatedResponse;
import org.apache.fineract.operations.BatchRepository;
import org.apache.fineract.operations.Transfer;
import org.apache.fineract.operations.TransferRepository;
import org.apache.fineract.operations.TransferStatus;
import org.apache.fineract.operations.Variable;
import org.apache.fineract.operations.VariableRepository;
import org.apache.fineract.service.BatchDbService;
import org.apache.fineract.utils.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.apache.fineract.core.service.OperatorUtils.strip;

@Slf4j
@RestController
@SecurityRequirement(name = "auth")
@RequestMapping("/api/v1")
public class BatchApi {
    @Autowired
    private TransferRepository transferRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private VariableRepository variableRepository;

    @Autowired
    @Qualifier("awsStorage")
    private FileTransferService fileTransferService;

    @Autowired
    private PaymentModeConfiguration paymentModeConfig;

    @Autowired
    private DateUtil dateUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BatchDbService batchDbService;

    @Value("${application.bucket-name}")
    private String bucketName;

    private Sort getSortObject(String sort) {
        Sort.Direction sortDirection;
        String sortedBy;
        if (sort.contains("+") && sort.split("\\+").length == 2) {
            sortDirection = Sort.Direction.ASC;
            sortedBy = sort.split("\\+")[1];
        } else if (sort.contains("-") && sort.split("-").length == 2) {
            sortDirection = Sort.Direction.DESC;
            sortedBy = sort.split("-")[1];
        } else {
            sortDirection = Sort.Direction.ASC;
            sortedBy = sort;
        }
        sortedBy = sortedBy.replace(" ", "");
        log.info("Sorting by: {} and Sorting direction: {}", sortedBy, sortDirection.name());
        return new Sort(sortDirection, sortedBy);
    }

    @GetMapping("/batches")
    public BatchPaginatedResponse getBatch(@RequestParam(value = "offset", required = false, defaultValue = "0")
                                           Integer offset,
                                           @RequestParam(value = "limit", required = false, defaultValue = "10")
                                           Integer limit,
                                           @RequestParam(value = "sort", required = false,
                                                   defaultValue = "-startedAt") String sort,
                                           @RequestParam(value = "dateFrom", required = false) String startFrom,
                                           @RequestParam(value = "dateTo", required = false) String startTo,
                                           @RequestParam(value = "registeringInstitutionId", required = false,
                                                   defaultValue = "%") String registeringInstituteId,
                                           @RequestParam(value = "payerFsp", required = false, defaultValue = "%")
                                               String payerFsp,
                                           @RequestParam(value = "batchId", required = false, defaultValue = "%")
                                               String batchId,
                                           HttpServletResponse httpServletResponse) {
        log.info("Registering Id: {}, PayerFsp: {}, batchId: {}", registeringInstituteId, payerFsp, batchId);
        Sort sortObject = getSortObject(sort);
        int page = Math.floorDiv(offset, limit);
        PageRequest pager = PageRequest.of(page, limit, sortObject);

        if (startFrom != null) {
            startFrom = dateUtil.getUTCFormat(startFrom);
        }
        if (startTo != null) {
            startTo = dateUtil.getUTCFormat(startTo);
        }
        try {
            BatchPaginatedResponse batchPaginatedResponse;

            if (startFrom != null && startTo != null) {
                batchPaginatedResponse = batchDbService.getBatch(startFrom, startTo, registeringInstituteId, payerFsp, batchId, pager);
            } else if (startFrom != null) {
                batchPaginatedResponse = batchDbService.getBatchDateFrom(startFrom, registeringInstituteId, payerFsp, batchId, pager);
            } else if (startTo != null) {
                batchPaginatedResponse = batchDbService.getBatchDateTo(startTo, registeringInstituteId, payerFsp, batchId, pager);
            } else {
                batchPaginatedResponse = batchDbService.getBatch(registeringInstituteId, payerFsp, batchId, pager);
            }
            httpServletResponse.setStatus(200);
            return batchPaginatedResponse;
        } catch (Exception e) {
            e.printStackTrace();
            httpServletResponse.setStatus(400);
            return null;
        }
    }

    @GetMapping("/batch")
    public BatchDTO batchDetails(@RequestParam(value = "batchId", required = false) String batchId,
                                 @RequestParam(value = "requestId", required = false) String requestId) {
        Batch batch = batchRepository.findByBatchId(batchId);
        if (batch != null) {
            if (batch.getResultGeneratedAt() != null) {
//                Checks if last status was checked before 10 mins
                if (new Date().getTime() - batch.getResultGeneratedAt().getTime() < 600000) {
                    return generateDetails(batch);
                } else {
                    return generateDetails(batch);
                }
            } else {
                return generateDetails(batch);
            }
        } else {
            Batch batch1 = new Batch();
            batch1.setBatchId(batchId);
            batch1.setRequestId(requestId);
            return generateDetails(batch1);
        }

    }

    @GetMapping("/batch/detail")
    public Page<Transfer> batchDetails(HttpServletResponse httpServletResponse,
                                       @RequestParam(value = "batchId") String batchId,
                                       @RequestParam(value = "status", defaultValue = "ALL") String status,
                                       @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                       @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize,
                                       @RequestParam(value = "command", required = false, defaultValue = "json") String command) {

        if (command.equalsIgnoreCase("download")) {
            Batch batch = batchRepository.findByBatchId(batchId);
            if (batch != null && batch.getResult_file() != null) {
                httpServletResponse.setHeader("Location", batch.getResult_file());
                httpServletResponse.setStatus(302);
            } else {
                httpServletResponse.setStatus(404);
            }
            return null;
        }

        Page<Transfer> transfers;

        if (status.equalsIgnoreCase(TransferStatus.COMPLETED.toString()) ||
                status.equalsIgnoreCase(TransferStatus.IN_PROGRESS.toString()) ||
                status.equalsIgnoreCase(TransferStatus.FAILED.toString())) {
            transfers = transferRepository.findAllByBatchIdAndStatus(batchId, status.toUpperCase(), new PageRequest(pageNo, pageSize));
        } else {
            transfers = transferRepository.findAllByBatchId(batchId, new PageRequest(pageNo, pageSize));
        }

        return transfers;
    }

    @GetMapping("/batch/transactions")
    public HashMap<String, String> batchTransactionDetails(@RequestParam String batchId) {
        Batch batch = batchRepository.findByBatchId(batchId);
        if (batch != null) {
            List<Transfer> transfers = transferRepository.findAllByBatchId(batch.getBatchId());
            HashMap<String, String> status = new HashMap<>();
            for (Transfer transfer : transfers) {
                status.put(transfer.getTransactionId(), transfer.getStatus().name());
            }
            return status;
        } else {
            return null;
        }
    }

    private BatchDTO generateDetails(Batch batch) {

        StringBuilder modes = new StringBuilder();

        List<Transfer> transfers = transferRepository.findAllByBatchId(batch.getBatchId());

        List<Batch> allBatches = batchRepository.findAllByBatchId(batch.getBatchId());

        Long completed = 0L;
        Long failed = 0L;
        Long total = 0L;
        Long ongoing = 0L;
        Double batchFailedPercent = 0.0;
        Double batchCompletedPercent = 0.0;
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal completedAmount = BigDecimal.ZERO;
        BigDecimal ongoingAmount = BigDecimal.ZERO;
        BigDecimal failedAmount = BigDecimal.ZERO;

        for (Transfer transfer : transfers) {
            Optional<Variable> variable = variableRepository.findByWorkflowInstanceKeyAndVariableName("paymentMode",
                    transfer.getWorkflowInstanceKey());
            if (variable.isPresent()) {
                // this will prevent 2x count of variables by eliminating data from transfers table
                if (paymentModeConfig.getByMode(strip(variable.get().getValue()))
                        .getType().equalsIgnoreCase("BATCH")) {
                    continue;
                }
            }
            total++;
            BigDecimal amount = transfer.getAmount();
            totalAmount = totalAmount.add(amount);
            if (transfer.getStatus().equals(TransferStatus.COMPLETED)) {
                completed++;
                completedAmount = completedAmount.add(amount);
            } else if (transfer.getStatus().equals(TransferStatus.FAILED)) {
                failed++;
                failedAmount = failedAmount.add(amount);
            } else if (transfer.getStatus().equals(TransferStatus.IN_PROGRESS)) {
                if(transfer.getCompletedAt().toString().isEmpty()) {
                    ongoing++;
                    ongoingAmount = ongoingAmount.add(amount);
                }
                else {
                    completed++;
                    completedAmount = completedAmount.add(amount);
                }
            }
        }

        // calculating matrices for sub batches
        Long subBatchFailed = 0L;
        Long subBatchCompleted = 0L;
        Long subBatchOngoing = 0L;
        Long subBatchTotal = 0L;


        for (Batch bt : allBatches) {
            if (bt.getPaymentMode() != null && !modes.toString().contains(bt.getPaymentMode())) {
                if (!modes.toString().equals("")) {
                    modes.append(",");
                }
                modes.append(bt.getPaymentMode());
            }
            if (bt.getSubBatchId() == null || bt.getSubBatchId().isEmpty()) {
                continue;
            }
            if (bt.getFailed() != null) {
                subBatchFailed += bt.getFailed();
                failedAmount = failedAmount.add(BigDecimal.valueOf(bt.getFailedAmount()));
            }
            if (bt.getCompleted() != null) {
                subBatchCompleted += bt.getCompleted();
                completedAmount = completedAmount.add(BigDecimal.valueOf(bt.getCompletedAmount()));
            }
            if (bt.getOngoing() != null) {
                subBatchOngoing += bt.getOngoing();
                ongoingAmount = ongoingAmount.add(BigDecimal.valueOf(bt.getOngoingAmount()));
            }
            if (bt.getTotalTransactions() != null) {
                subBatchTotal += bt.getTotalTransactions();
                totalAmount = totalAmount.add(BigDecimal.valueOf(bt.getTotalAmount()));
            }
        }

        // updating the data with sub batches details
        completed += subBatchCompleted;
        failed += subBatchFailed;
        total += subBatchTotal;


        ongoing += subBatchOngoing;

        if (batch.getResult_file() == null || (batch.getResult_file() != null && batch.getResult_file().isEmpty())) {
            batch.setResult_file(createDetailsFile(transfers));
        }
        batch.setCompleted(completed);
        batch.setFailed(failed);
        batch.setResultGeneratedAt(new Date());
        batch.setOngoing(ongoing);
        batch.setTotalTransactions(total);
        batchRepository.save(batch);
        batchCompletedPercent = (double) batch.getCompleted() / total * 100;
        batchFailedPercent = (double) batch.getFailed() / total * 100;

        BatchDTO response = new BatchDTO(batch.getBatchId(),
                batch.getRequestId(), batch.getTotalTransactions(), batch.getOngoing(),
                batch.getFailed(), batch.getCompleted(), totalAmount, completedAmount,
                ongoingAmount, failedAmount, batch.getResult_file(), batch.getNote(),
                batchCompletedPercent.toString(), batchFailedPercent.toString(), batch.getRegisteringInstitutionId(),
                batch.getPayerFsp(), batch.getCorrelationId());

        response.setCreated_at("" + batch.getStartedAt());
        response.setModes(modes.toString());
        response.setPurpose("Unknown purpose");
        System.out.println("Batch details generated for batchId: " + response.getSuccessPercentage());

        if (batch.getCompleted().longValue() == batch.getTotalTransactions().longValue()) {
            response.setStatus("COMPLETED");
        } else if (batch.getOngoing() != 0 && batch.getCompletedAt() == null) {
            response.setStatus("Pending");
        } else if (batch.getFailed().longValue() == batch.getFailed().longValue()) {
            response.setStatus("Failed");
        } else {
            response.setStatus("UNKNOWN");
        }

        return response;
    }

    private String createDetailsFile(List<Transfer> transfers) {
        String CSV_SEPARATOR = ",";
        File tempFile = new File(System.currentTimeMillis() + "_response.csv");
        try (
                FileWriter writer = new FileWriter(tempFile.getName());
                BufferedWriter bw = new BufferedWriter(writer)) {
            for (Transfer transfer : transfers) {
                StringBuffer oneLine = new StringBuffer();
                oneLine.append(transfer.getTransactionId());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getStatus().toString());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getPayeeDfspId());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getPayeePartyId());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getPayerDfspId());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getPayerPartyId());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getAmount().toString());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getCurrency());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getErrorInformation());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getStartedAt().toString());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(transfer.getCompletedAt().toString());
                oneLine.append(CSV_SEPARATOR);
                bw.write(oneLine.toString());
                bw.newLine();
            }
            bw.flush();
            return fileTransferService.uploadFile(tempFile, bucketName);
        } catch (Exception e) {
            System.err.format("Exception: %s%n", e);
        }
        return null;
    }

}
