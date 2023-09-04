package org.apache.fineract.operations;

import org.springframework.data.jpa.domain.Specifications;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Path;
import javax.persistence.metamodel.SingularAttribute;
import java.util.Date;
import java.util.List;

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

    public static <T> Specifications<Transfer> multiMatch(SingularAttribute<Transfer, T> attribute1, SingularAttribute<Transfer, T> attribute2, T input) {
        return where((root, query, builder) -> builder.or(
                builder.equal(root.get(attribute1), input),
                builder.equal(root.get(attribute2), input)
        ));
    }

    public static <T> Specifications<Transfer> in(SingularAttribute<Transfer, T> attribute,
                                                  List<T> inputs) {
        return where(((root, query, cb) -> {
            final Path<T> group = root.get(attribute);
            CriteriaBuilder.In<T> cr = cb.in(group);
            for (T input : inputs) {
                cr.value(input);
            }
            return cr;
        }));
    }
}

