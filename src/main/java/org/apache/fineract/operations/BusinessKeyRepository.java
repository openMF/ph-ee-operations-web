package org.apache.fineract.operations;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BusinessKeyRepository extends CrudRepository<BusinessKey, Long> {

    List<BusinessKey> findByBusinessKeyAndBusinessKeyType(String businessKey, String businessKeyType);

}
