package org.apache.fineract.config;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PaymentMode {

    private String id, type;

    public PaymentMode(String id, String type) {
        this.id = id;
        this.type = type;
    }
}
