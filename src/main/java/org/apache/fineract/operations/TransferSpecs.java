package org.apache.fineract.operations;

import org.springframework.data.jpa.domain.Specifications;

import javax.persistence.metamodel.SingularAttribute;
import java.util.Date;

import static org.springframework.data.jpa.domain.Specifications.where;

public class TransferSpecs {

    public static Specifications<Transfer> between(SingularAttribute<Transfer, Date> attribute, Date from, Date to) {
        return where((root, query, builder) -> builder.and(
                builder.greaterThanOrEqualTo(root.get(attribute), from),
                builder.lessThanOrEqualTo(root.get(attribute), to)
        ));
    }

    public static Specifications<Transfer> later(SingularAttribute<Transfer, Date> attribute, Date from) {
        return where((root, query, builder) -> builder.greaterThanOrEqualTo(root.get(attribute), from));
    }

    public static Specifications<Transfer> earlier(SingularAttribute<Transfer, Date> attribute, Date to) {
        return where((root, query, builder) -> builder.lessThanOrEqualTo(root.get(attribute), to));
    }


    public static <T> Specifications<Transfer> match(SingularAttribute<Transfer, T> attribute, T input) {
        return where((root, query, builder) -> builder.equal(root.get(attribute), input));
    }
}