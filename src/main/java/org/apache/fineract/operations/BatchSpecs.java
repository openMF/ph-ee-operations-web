package org.apache.fineract.operations;

import org.springframework.data.jpa.domain.Specifications;

import javax.persistence.metamodel.SingularAttribute;

import static org.springframework.data.jpa.domain.Specifications.where;

public class BatchSpecs {

    public static <T> Specifications<Batch> match(SingularAttribute<Batch, T> attribute, T input) {
        return where((root, query, builder) -> builder.equal(root.get(attribute), input));
    }
}
