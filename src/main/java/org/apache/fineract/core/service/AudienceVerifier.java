package org.apache.fineract.core.service;

import org.apache.fineract.organisation.tenant.TenantServerConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.security.oauth2.provider.token.store.JwtClaimsSetVerifier;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class AudienceVerifier implements JwtClaimsSetVerifier {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void verify(Map<String, Object> claims) throws InvalidTokenException {
        TenantServerConnection tenant = ThreadLocalContextUtil.getTenant();
        List<String> audiences = (List) claims.get("aud");
        audiences.stream()
                .filter(a -> tenant.getSchemaName().equals(a))
                .findFirst()
                .orElseThrow(() -> {
                    String message = "Token audiences " + audiences + " are not matching with request " + tenant.getSchemaName();
                    logger.error(message);
                    return new RuntimeException(message);
                });
    }
}
