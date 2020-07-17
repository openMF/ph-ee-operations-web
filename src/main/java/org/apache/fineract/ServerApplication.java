/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.fineract;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.fineract.core.service.AudienceVerifier;
import org.apache.fineract.core.service.TenantAwareHeaderFilter;
import org.apache.fineract.organisation.tenant.TenantServerConnectionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.web.ErrorMvcAutoConfiguration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@SpringBootApplication
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class,
        FlywayAutoConfiguration.class,
        ErrorMvcAutoConfiguration.class})
public class ServerApplication {

    /**
     * Spring security filter chain ordering, the tenant header filter
     * must run before this to set current tenant so it's order has to be lower to gain priority
     */
    @Value("${security.filter-order}")
    private int securityFilterOrder;

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }

    @Bean
    public ObjectMapper mapper() {
        return new ObjectMapper();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider customAuthenticationProvider(PasswordEncoder passwordEncoder,
                                                                  UserDetailsService userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public FilterRegistrationBean tenantFilter(TenantServerConnectionRepository repository) {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new TenantAwareHeaderFilter(repository));
        registration.addUrlPatterns("/*");
        registration.setName("tenantFilter");
        registration.setOrder(securityFilterOrder - 4);
        return registration;
    }

    @Bean
    public FilterRegistrationBean corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
        bean.setOrder(securityFilterOrder - 5);
        return bean;
    }

    @Bean
    @Primary
    public TokenStore tokenStore(JwtAccessTokenConverter accessTokenConverter) {
        return new JwtTokenStore(accessTokenConverter);
    }

    @Bean
    @Primary
    public DefaultTokenServices tokenServices(TokenStore tokenStore) {
        DefaultTokenServices service = new DefaultTokenServices();
        service.setTokenStore(tokenStore);
        return service;
    }

    @Bean
    @Primary
    public JwtAccessTokenConverter accessTokenConverter(AudienceVerifier verifier) throws IOException, URISyntaxException {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setSigningKey(getPemContent("jwt.pem"));
        converter.setVerifierKey(getPemContent("jwt_pub.pem"));
        converter.setJwtClaimsSetVerifier(verifier);
        return converter;
    }

    private String getPemContent(String file) throws IOException, URISyntaxException {
        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new ClassPathResource(file).getInputStream()))) {
            return bufferedReader.lines().collect(Collectors.joining(""));
        }
    }

    @Bean
    public AuthenticationManager authenticationManager(DaoAuthenticationProvider customAuthenticationProvider) {
        List<AuthenticationProvider> providers = new ArrayList<>();
        providers.add(customAuthenticationProvider);
        return new ProviderManager(providers);
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(ServerApplication.class, args);
    }
}