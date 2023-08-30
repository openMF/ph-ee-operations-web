package org.apache.fineract.service;

import org.apache.fineract.operations.BatchPaginatedResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public interface BatchDbService {

    public BatchPaginatedResponse getBatch(String startFrom, String startTo, String registeringInstitutionId,
                                           String payerFsp, String batchId, PageRequest pager);

    public BatchPaginatedResponse getBatch(String registeringInstitutionId, String payerFsp, String batchId, PageRequest pager);

    public BatchPaginatedResponse getBatchDateTo(String startTo, String registeringInstitutionId,
                                           String payerFsp, String batchId, PageRequest pager);

    public BatchPaginatedResponse getBatchDateFrom(String startFrom, String registeringInstitutionId,
                                                 String payerFsp, String batchId, PageRequest pager);
}
