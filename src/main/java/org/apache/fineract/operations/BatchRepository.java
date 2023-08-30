package org.apache.fineract.operations;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface BatchRepository extends JpaRepository<Batch, Long>, JpaSpecificationExecutor<Batch> {

    Batch findByWorkflowInstanceKey(Long workflowInstanceKey);

    @Query("SELECT bt FROM Batch bt WHERE bt.batchId = :batchId and bt.subBatchId is null")
    Batch findByBatchId(String batchId);

    List<Batch> findAllByBatchId(String batchId);

    @Query("SELECT bt FROM Batch bt " +
            "WHERE bt.registeringInstitutionId LIKE :registeringInstituteId AND bt.payerFsp LIKE :payerFsp AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    List<Batch> findAllBatch(String registeringInstituteId, String payerFsp, String batchId, Pageable pageable);

    @Query(value = "SELECT bt FROM Batch bt WHERE bt.startedAt >= :dateFrom AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    List<Batch> findAllFilterDateFrom(Date dateFrom, String registeringInstitutionId, String payerFsp, String batchId, Pageable pageable);

    @Query(value = "SELECT bt FROM Batch bt WHERE bt.startedAt <= :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    List<Batch> findAllFilterDateTo(Date dateTo, String registeringInstitutionId, String payerFsp, String batchId, Pageable pageable);

    @Query(value = "SELECT bt FROM Batch bt WHERE bt.startedAt BETWEEN :dateFrom AND :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    List<Batch> findAllFilterDateBetween(Date dateFrom, Date dateTo, String registeringInstitutionId, String payerFsp, String batchId, Pageable pageable);


    @Query(value = "SELECT COUNT(bt) FROM Batch bt " +
            "WHERE (bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalBatches(String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT COUNT(bt) FROM Batch bt " +
            "WHERE bt.startedAt >= :dateFrom AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalBatchesDateFrom(Date dateFrom, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT COUNT(bt) FROM Batch bt " +
            "WHERE bt.startedAt <= :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalBatchesDateTo(Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT COUNT(bt) FROM Batch bt " +
            "WHERE bt.startedAt BETWEEN :dateFrom AND :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalBatchesDateBetween(Date dateFrom, Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.totalTransactions) FROM Batch bt " +
            "WHERE (bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalTransactions(String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.totalTransactions) FROM Batch bt " +
            "WHERE bt.startedAt >= :dateFrom AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalTransactionsDateFrom(Date dateFrom, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.totalTransactions) FROM Batch bt " +
            "WHERE bt.startedAt <= :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalTransactionsDateTo(Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.totalTransactions) FROM Batch bt " +
            "WHERE bt.startedAt BETWEEN :dateFrom AND :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalTransactionsDateBetween(Date dateFrom, Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.totalAmount) FROM Batch bt " +
            "WHERE (bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalAmount(String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.totalAmount) FROM Batch bt " +
            "WHERE bt.startedAt >= :dateFrom AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalAmountDateFrom(Date dateFrom, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.totalAmount) FROM Batch bt " +
            "WHERE bt.startedAt <= :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalAmountDateTo(Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.totalAmount) FROM Batch bt " +
            "WHERE bt.startedAt BETWEEN :dateFrom AND :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalAmountDateBetween(Date dateFrom, Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.approvedAmount) FROM Batch bt " +
            "WHERE (bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalApprovedAmount(String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.approvedAmount) FROM Batch bt " +
            "WHERE bt.startedAt >= :dateFrom AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalApprovedAmountDateFrom(Date dateFrom, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.approvedAmount) FROM Batch bt " +
            "WHERE bt.startedAt <= :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalApprovedAmountDateTo(Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.approvedAmount) FROM Batch bt " +
            "WHERE bt.startedAt BETWEEN :dateFrom AND :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalApprovedAmountDateBetween(Date dateFrom, Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.approvedCount) FROM Batch bt " +
            "WHERE (bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalApprovedCount(String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.approvedCount) FROM Batch bt " +
            "WHERE bt.startedAt >= :dateFrom AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalApprovedCountDateFrom(Date dateFrom, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.approvedCount) FROM Batch bt " +
            "WHERE bt.startedAt <= :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalApprovedCountDateTo(Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);

    @Query(value = "SELECT SUM(bt.approvedCount) FROM Batch bt " +
            "WHERE bt.startedAt BETWEEN :dateFrom AND :dateTo AND " +
            "(bt.registeringInstitutionId LIKE :registeringInstitutionId) AND (bt.payerFsp LIKE :payerFsp) AND " +
            "bt.batchId LIKE :batchId AND bt.subBatchId IS NULL")
    Optional<Long> getTotalApprovedCountDateBetween(Date dateFrom, Date dateTo, String registeringInstitutionId, String payerFsp, String batchId);
}
