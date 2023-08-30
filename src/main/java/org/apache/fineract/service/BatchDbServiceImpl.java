package org.apache.fineract.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.fineract.core.service.ThreadLocalContextUtil;
import org.apache.fineract.operations.Batch;
import org.apache.fineract.operations.BatchPaginatedResponse;
import org.apache.fineract.operations.BatchRepository;
import org.apache.fineract.organisation.tenant.TenantServerConnection;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import static org.apache.fineract.core.service.OperatorUtils.dateFormat;

/**
 * For all the date part use the below format and make sure to pass the local date
 * DD:MM:YYYY hh:mm:ss
 */
@Slf4j
@Service
public class BatchDbServiceImpl implements BatchDbService {

    private final BatchRepository batchRepository;

    public BatchDbServiceImpl(BatchRepository batchRepository) {
        this.batchRepository = batchRepository;
    }

    @Override
    public BatchPaginatedResponse getBatch(String startFrom, String startTo, String registeringInstitutionId, String payerFsp, String batchId, PageRequest pager) {
        try {
            Date startDateObject = dateFormat().parse(startFrom);
            Date endDateObject = dateFormat().parse(startTo);
            TenantServerConnection connection = ThreadLocalContextUtil.getTenant();

            CompletableFuture<Optional<Long>> totalTransactionsAsync =
                    CompletableFuture.supplyAsync(() -> {
                        ThreadLocalContextUtil.setTenant(connection);
                        return batchRepository.getTotalTransactionsDateBetween(
                                startDateObject, endDateObject,
                                registeringInstitutionId, payerFsp, batchId);
                    });
            CompletableFuture<Optional<Long>> totalAmountAsync =
                    CompletableFuture.supplyAsync(() -> {
                        ThreadLocalContextUtil.setTenant(connection);
                        return batchRepository.getTotalAmountDateBetween(
                                startDateObject, endDateObject,
                                registeringInstitutionId, payerFsp, batchId);
                    });
            CompletableFuture<Optional<Long>> totalBatchesAsync =
                    CompletableFuture.supplyAsync(() -> {
                        ThreadLocalContextUtil.setTenant(connection);
                        return batchRepository.getTotalBatchesDateBetween(
                                startDateObject, endDateObject,
                                registeringInstitutionId, payerFsp, batchId);
                    });
            CompletableFuture<Optional<Long>> totalApprovedCountAsync =
                    CompletableFuture.supplyAsync(() -> {
                        ThreadLocalContextUtil.setTenant(connection);
                        return batchRepository.getTotalApprovedCountDateBetween(
                                startDateObject, endDateObject,
                                registeringInstitutionId, payerFsp, batchId);
                    });
            CompletableFuture<Optional<Long>> totalApprovedAmountAsync =
                    CompletableFuture.supplyAsync(() -> {
                        ThreadLocalContextUtil.setTenant(connection);
                        return batchRepository.getTotalApprovedAmountDateBetween(
                                startDateObject, endDateObject,
                                registeringInstitutionId, payerFsp, batchId);
                    });
            CompletableFuture<List<Batch>> batchesAsync =
                    CompletableFuture.supplyAsync(() -> {
                        ThreadLocalContextUtil.setTenant(connection);
                        return batchRepository.findAllFilterDateBetween(
                                startDateObject, endDateObject,
                                registeringInstitutionId, payerFsp, batchId,
                                pager);
                    });

            CompletableFuture<Void> allTasks = CompletableFuture.allOf(totalTransactionsAsync, totalAmountAsync,
                    totalBatchesAsync, totalApprovedCountAsync, totalApprovedAmountAsync, batchesAsync);
            allTasks.join();

            Optional<Long> totalTransactions = totalTransactionsAsync.join();
            Optional<Long> totalAmount = totalAmountAsync.join();
            Optional<Long> totalBatches = totalBatchesAsync.join();
            Optional<Long> totalApprovedCount = totalApprovedCountAsync.join();
            Optional<Long> totalApprovedAmount = totalApprovedAmountAsync.join();
            List<Batch> batches = batchesAsync.join();

            return getBatchPaginatedResponseInstance(totalBatches.orElse(0L), totalTransactions.orElse(0L),
                    totalAmount.orElse(0L), totalApprovedCount.orElse(0L),
                    totalApprovedAmount.orElse(0L), 10, batches);
        } catch (Exception e) {
            log.warn("failed to parse dates {} / {}", startFrom, startTo);
            return null;
        }
    }

    @Override
    public BatchPaginatedResponse getBatch(String registeringInstitutionId, String payerFsp, String batchId, PageRequest pager) {
        log.info("Get batch function");
        TenantServerConnection connection = ThreadLocalContextUtil.getTenant();

        CompletableFuture<Optional<Long>> totalTransactionsAsync = CompletableFuture.supplyAsync(() -> {
            ThreadLocalContextUtil.setTenant(connection);
            return batchRepository.getTotalTransactions(registeringInstitutionId, payerFsp, batchId);
        });
        CompletableFuture<Optional<Long>> totalAmountAsync = CompletableFuture.supplyAsync(() -> {
            ThreadLocalContextUtil.setTenant(connection);
            return batchRepository.getTotalAmount(registeringInstitutionId, payerFsp, batchId);
        });
        CompletableFuture<Optional<Long>> totalBatchesAsync = CompletableFuture.supplyAsync(() -> {
            ThreadLocalContextUtil.setTenant(connection);
            return batchRepository.getTotalBatches(registeringInstitutionId, payerFsp, batchId);
        });
        CompletableFuture<Optional<Long>> totalApprovedCountAsync = CompletableFuture.supplyAsync(() -> {
            ThreadLocalContextUtil.setTenant(connection);
            return batchRepository.getTotalApprovedCount(registeringInstitutionId, payerFsp, batchId);
        });
        CompletableFuture<Optional<Long>> totalApprovedAmountAsync = CompletableFuture.supplyAsync(() -> {
            ThreadLocalContextUtil.setTenant(connection);
            return batchRepository.getTotalApprovedAmount(registeringInstitutionId, payerFsp, batchId);
        });
        CompletableFuture<List<Batch>> batchesAsync = CompletableFuture.supplyAsync(() -> {
            ThreadLocalContextUtil.setTenant(connection);
            return batchRepository.findAllBatch(registeringInstitutionId, payerFsp, batchId, pager);
        });

        CompletableFuture<Void> allTasks = CompletableFuture.allOf(totalTransactionsAsync, totalAmountAsync,
                totalBatchesAsync, totalApprovedCountAsync, totalApprovedAmountAsync, batchesAsync);
        allTasks.join();

        Optional<Long> totalTransactions = totalTransactionsAsync.join();
        Optional<Long> totalAmount = totalAmountAsync.join();
        Optional<Long> totalBatches = totalBatchesAsync.join();
        Optional<Long> totalApprovedCount = totalApprovedCountAsync.join();
        Optional<Long> totalApprovedAmount = totalApprovedAmountAsync.join();
        List<Batch> batches = batchesAsync.join();
        return getBatchPaginatedResponseInstance(totalBatches.orElse(0L), totalTransactions.orElse(0L),
                totalAmount.orElse(0L), totalApprovedCount.orElse(0L),
                totalApprovedAmount.orElse(0L), 10, batches);
    }

    @Override
    public BatchPaginatedResponse getBatchDateTo(String startTo, String registeringInstitutionId, String payerFsp, String batchId, PageRequest pager) {
        try {
            Date endDateObject = dateFormat().parse(startTo);
            TenantServerConnection connection = ThreadLocalContextUtil.getTenant();

            CompletableFuture<Optional<Long>> totalTransactionsAsync = CompletableFuture.supplyAsync(() -> {
               ThreadLocalContextUtil.setTenant(connection);
               return batchRepository.getTotalTransactionsDateTo(
                       endDateObject,
                       registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<Optional<Long>> totalAmountAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return batchRepository.getTotalAmountDateTo(
                        endDateObject,
                        registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<Optional<Long>> totalBatchesAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return batchRepository.getTotalBatchesDateTo(
                        endDateObject,
                        registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<Optional<Long>> totalApprovedCountAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return batchRepository.getTotalApprovedCountDateTo(
                        endDateObject,
                        registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<Optional<Long>> totalApprovedAmountAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return batchRepository.getTotalApprovedAmountDateTo(
                        endDateObject,
                        registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<List<Batch>> batchesAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return batchRepository.findAllFilterDateTo(
                        endDateObject,
                        registeringInstitutionId, payerFsp, batchId, pager);
            });

            CompletableFuture<Void> allTasks = CompletableFuture.allOf(totalTransactionsAsync, totalAmountAsync,
                    totalBatchesAsync, totalApprovedCountAsync, totalApprovedAmountAsync, batchesAsync);
            allTasks.join();

            Optional<Long> totalTransactions = totalTransactionsAsync.join();
            Optional<Long> totalAmount = totalAmountAsync.join();
            Optional<Long> totalBatches = totalBatchesAsync.join();
            Optional<Long> totalApprovedCount = totalApprovedCountAsync.join();
            Optional<Long> totalApprovedAmount = totalApprovedAmountAsync.join();
            List<Batch> batches = batchesAsync.join();
            return getBatchPaginatedResponseInstance(totalBatches.orElse(0L), totalTransactions.orElse(0L),
                    totalAmount.orElse(0L), totalApprovedCount.orElse(0L),
                    totalApprovedAmount.orElse(0L), 10, batches);
        } catch (Exception e) {
            log.warn("failed to parse startTo date {}", startTo);
            return null;
        }
    }

    @Override
    public BatchPaginatedResponse getBatchDateFrom(String startFrom, String registeringInstitutionId, String payerFsp, String batchId, PageRequest pager) {
        try {
            Date startDateObject = dateFormat().parse(startFrom);
            TenantServerConnection connection = ThreadLocalContextUtil.getTenant();

            CompletableFuture<Optional<Long>> totalTransactionsAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return  batchRepository.getTotalTransactionsDateFrom(
                        startDateObject,
                        registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<Optional<Long>> totalAmountAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return  batchRepository.getTotalAmountDateFrom(
                        startDateObject,
                        registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<Optional<Long>> totalBatchesAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return  batchRepository.getTotalBatchesDateFrom(
                        startDateObject,
                        registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<Optional<Long>> totalApprovedCountAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return  batchRepository.getTotalApprovedCountDateFrom(
                        startDateObject,
                        registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<Optional<Long>> totalApprovedAmountAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return  batchRepository.getTotalApprovedAmountDateFrom(
                        startDateObject,
                        registeringInstitutionId, payerFsp, batchId);
            });
            CompletableFuture<List<Batch>> batchesAsync = CompletableFuture.supplyAsync(() -> {
                ThreadLocalContextUtil.setTenant(connection);
                return batchRepository.findAllFilterDateFrom(
                        startDateObject,
                        registeringInstitutionId, payerFsp, batchId, pager);
            });

            CompletableFuture<Void> allTasks = CompletableFuture.allOf(totalTransactionsAsync, totalAmountAsync,
                    totalBatchesAsync, totalApprovedCountAsync, totalApprovedAmountAsync, batchesAsync);
            allTasks.join();

            Optional<Long> totalTransactions = totalTransactionsAsync.join();
            Optional<Long> totalAmount = totalAmountAsync.join();
            Optional<Long> totalBatches = totalBatchesAsync.join();
            Optional<Long> totalApprovedCount = totalApprovedCountAsync.join();
            Optional<Long> totalApprovedAmount = totalApprovedAmountAsync.join();
            List<Batch> batches = batchesAsync.join();
            return getBatchPaginatedResponseInstance(totalBatches.orElse(0L), totalTransactions.orElse(0L),
                    totalAmount.orElse(0L), totalApprovedCount.orElse(0L),
                    totalApprovedAmount.orElse(0L), 10, batches);
        } catch (Exception e) {
            log.warn("failed to parse startFrom date {}", startFrom);
            return null;
        }
    }


    private BatchPaginatedResponse getBatchPaginatedResponseInstance(long totalBatches, long totalTransactions,
                                                                     long totalAmount, long totalApprovedCount,
                                                                     long totalApprovedAmount,
                                                                     long totalSubBatchesCreated, List<Batch> batches) {
        log.info("Inside getBatchPaginatedResponseInstance");
        log.info("TotalBatch: {}, TotalTransactions: {}, Total Amount: {}, Batches: {}",
                totalBatches, totalTransactions, totalAmount, batches.size());
        BatchPaginatedResponse batchPaginatedResponse = new BatchPaginatedResponse();
        batchPaginatedResponse.setData(batches);
        batchPaginatedResponse.setTotalBatches(totalBatches);
        batchPaginatedResponse.setTotalTransactions(totalTransactions);
        batchPaginatedResponse.setTotalAmount(totalAmount);
        batchPaginatedResponse.setTotalApprovedCount(totalApprovedCount);
        batchPaginatedResponse.setTotalApprovedAmount(totalApprovedAmount);
        batchPaginatedResponse.setTotalSubBatchesCreated(totalSubBatchesCreated);
        return batchPaginatedResponse;
    }
}
