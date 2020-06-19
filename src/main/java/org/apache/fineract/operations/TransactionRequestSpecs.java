package org.apache.fineract.operations;

import org.springframework.data.jpa.domain.Specifications;

import javax.persistence.metamodel.SingularAttribute;
import java.util.Date;

import static org.springframework.data.jpa.domain.Specifications.where;

public class TransactionRequestSpecs {

    public static Specifications<TransactionRequest> between(SingularAttribute<TransactionRequest, Date> attribute, Date from, Date to) {
        return where((root, query, builder) -> builder.and(
                builder.greaterThanOrEqualTo(root.get(attribute), from),
                builder.lessThanOrEqualTo(root.get(attribute), to)
        ));
    }

    public static Specifications<TransactionRequest> later(SingularAttribute<TransactionRequest, Date> attribute, Date from) {
        return where((root, query, builder) -> builder.greaterThanOrEqualTo(root.get(attribute), from));
    }

    public static Specifications<TransactionRequest> earlier(SingularAttribute<TransactionRequest, Date> attribute, Date to) {
        return where((root, query, builder) -> builder.lessThanOrEqualTo(root.get(attribute), to));
    }


    public static <T> Specifications<TransactionRequest> match(SingularAttribute<TransactionRequest, T> attribute, T input) {
        return where((root, query, builder) -> builder.equal(root.get(attribute), input));
    }
}