package org.apache.fineract.config;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Component
@ConfigurationProperties(prefix = "payment")
public class PaymentModeConfiguration {

    private List<PaymentMode> modes = new ArrayList<>();

    public PaymentMode getByMode(String id) {
        return getModes().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst()
                .orElse(new PaymentMode("UNKNOWN", "UNKNOWN"));
    }

}
