package org.apache.fineract.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;

import java.util.List;

@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    public static final String IDENTITY_PROVIDER_RESOURCE_ID = "identity-provider";

    @Autowired
    private DefaultTokenServices tokenServices;

    @Autowired
    private AuthProperties authProperties;

    @Value("${rest.authorization.enabled}")
    private boolean isRestAuthEnabled;

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources.resourceId(IDENTITY_PROVIDER_RESOURCE_ID)
                .stateless(true)
                .tokenServices(tokenServices);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        if (!isRestAuthEnabled) {
            http.authorizeRequests().antMatchers("/api/v1/**").permitAll()
                    .and()
                    .csrf().disable()
                    //.anonymous().disable() important to enable, if not, the request will always fail with 401 regardless of permission settings
                    .cors().disable()
                    .formLogin().disable()
                    .httpBasic().disable()
                    .rememberMe().disable()
                    .x509().disable()
                    .jee().disable();
        } else {
            SessionManagementConfigurer<HttpSecurity> httpConfig = http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

            ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry authorization = httpConfig.and()
                    .authorizeRequests();
            List<EndpointSetting> settings = authProperties.getSettings();
            if (settings.isEmpty()) {
                throw new RuntimeException("Configuration property rest.authorization.settings can not be empty!");
            } else {
                for (EndpointSetting setting : settings) {
                    authorization = authorization.antMatchers(setting.getEndpoint()).access(setting.getAuthority());
                }
            }

            authorization.anyRequest()
                    .fullyAuthenticated()
                    .and()
                    .csrf().disable()
                    .anonymous().disable()
                    .cors().disable()
                    .formLogin().disable()
                    .httpBasic().disable()
                    .rememberMe().disable()
                    .x509().disable()
                    .jee().disable();
        }
    }
}
