package org.apache.fineract.api;


import org.apache.fineract.operations.Transfer;
import org.apache.fineract.operations.TransferRepository;
import org.apache.fineract.operations.TransferSpecs;
import org.apache.fineract.operations.TransferStatus;
import org.apache.fineract.operations.Transfer_;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.apache.fineract.core.service.OperatorUtils.dateFormat;


@RestController
@RequestMapping("/api/v1")
public class OperationsDetailedApi {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private TransferRepository transferRepository;

    @GetMapping("/transactions")
    public Page<Transfer> transactions(
            @RequestParam(value = "page") Integer page,
            @RequestParam(value = "size") Integer size,
            @RequestParam(value = "payerPartyId", required = false) String payerPartyId,
            @RequestParam(value = "payeePartyId", required = false) String payeePartyId,
            @RequestParam(value = "payeeDfspId", required = false) String payeeDfspId,
            @RequestParam(value = "payerDfspId", required = false) String payerDfspId,
            @RequestParam(value = "transactionId", required = false) String transactionId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "amount", required = false) BigDecimal amount,
            @RequestParam(value = "currency", required = false) String currency,
            @RequestParam(value = "startFrom", required = false) String startFrom,
            @RequestParam(value = "startTo", required = false) String startTo,
            @RequestParam(value = "sortedBy", required = false) String sortedBy
    ) {
        List<Specifications<Transfer>> specs = new ArrayList<>();
        if (payerPartyId != null) {
            specs.add(TransferSpecs.match(Transfer_.payerPartyId, payerPartyId));
        }
        if (payeePartyId != null) {
            specs.add(TransferSpecs.match(Transfer_.payeePartyId, payeePartyId));
        }
        if (payeeDfspId != null) {
            specs.add(TransferSpecs.match(Transfer_.payeeDfspId, payeeDfspId));
        }
        if (payerDfspId != null) {
            specs.add(TransferSpecs.match(Transfer_.payerDfspId, payerDfspId));
        }
        if (transactionId != null) {
            specs.add(TransferSpecs.match(Transfer_.transactionId, transactionId));
        }
        if (status != null && parseStatus(status) != null) {
            specs.add(TransferSpecs.match(Transfer_.status, parseStatus(status)));
        }
        if (amount != null) {
            specs.add(TransferSpecs.match(Transfer_.amount, amount));
        }
        if (currency != null) {
            specs.add(TransferSpecs.match(Transfer_.currency, currency));
        }
        try {
            if (startFrom != null && startTo != null) {
                specs.add(TransferSpecs.between(Transfer_.startedAt, dateFormat().parse(startFrom), dateFormat().parse(startTo)));
            } else if (startFrom != null) {
                specs.add(TransferSpecs.later(Transfer_.startedAt, dateFormat().parse(startFrom)));
            } else if (startTo != null) {
                specs.add(TransferSpecs.earlier(Transfer_.startedAt, dateFormat().parse(startTo)));
            }
        } catch (Exception e) {
            logger.warn("failed to parse dates {} / {}", startFrom, startTo);
        }

        PageRequest pager;
        if (sortedBy == null || "startedAt".equals(sortedBy)) {
            pager = new PageRequest(page, size, new Sort(Sort.Direction.DESC, "startedAt"));
        } else {
            pager = new PageRequest(page, size, new Sort(Sort.Direction.ASC, sortedBy));
        }

        if (specs.size() > 0) {
            Specifications<Transfer> compiledSpecs = specs.get(0);
            for (int i = 1; i < specs.size(); i++) {
                compiledSpecs = compiledSpecs.and(specs.get(i));
            }

            return transferRepository.findAll(compiledSpecs, pager);
        } else {
            return transferRepository.findAll(pager);
        }
    }

    private TransferStatus parseStatus(@RequestParam(value = "transactionStatus", required = false) String
                                               transactionStatus) {
        try {
            return transactionStatus == null ? null : TransferStatus.valueOf(transactionStatus);
        } catch (Exception e) {
            logger.warn("failed to parse transaction status {}, ignoring it", transactionStatus);
            return null;
        }
    }
}
