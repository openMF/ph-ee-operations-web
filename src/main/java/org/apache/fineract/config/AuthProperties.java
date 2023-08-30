package org.apache.fineract.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "rest.authorization")
public class AuthProperties {

    private List<EndpointSetting> settings = new ArrayList<>();

    public AuthProperties() {
    }

    public List<EndpointSetting> getSettings() {
        return settings;
    }
}
