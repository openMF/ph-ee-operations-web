package org.apache.fineract.operations;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BeneficiaryRepository extends CrudRepository<Beneficiary, Long> {

    List<Beneficiary> findBycustIdentifier(String custIdentifier);

    Beneficiary findOneByCustIdentifierAndIdentifier(String custIdentifier, String identifier);
}
