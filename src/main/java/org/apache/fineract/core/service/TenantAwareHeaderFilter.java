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
package org.apache.fineract.core.service;

import org.apache.commons.lang3.time.StopWatch;
import org.apache.fineract.organisation.tenant.TenantServerConnectionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class TenantAwareHeaderFilter extends GenericFilterBean {

    private static final String TENANT_IDENTIFIER_REQUEST_HEADER = "Platform-TenantId";
    private static final String TENANT_IDENTIFIER_REQUEST_PARAM = "tenantIdentifier";
    private static final String EXCLUDED_URL = "/oauth/token_key";
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final TenantServerConnectionRepository repository;

    public TenantAwareHeaderFilter(TenantServerConnectionRepository repository) {
        this.repository = repository;
    }

    @Override
    public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain) throws IOException {
        final HttpServletRequest request = (HttpServletRequest) req;
        final HttpServletResponse response = (HttpServletResponse) res;
        final StopWatch task = new StopWatch();
        task.start();

        try {
            if(!EXCLUDED_URL.equals(request.getServletPath())) {
                String tenantIdentifier = request.getHeader(TENANT_IDENTIFIER_REQUEST_HEADER);
                if (tenantIdentifier == null || tenantIdentifier.length() < 1) {
                    tenantIdentifier = request.getParameter(TENANT_IDENTIFIER_REQUEST_PARAM);
                }

                if (tenantIdentifier == null || tenantIdentifier.length() < 1) {
                    throw new RuntimeException(
                            String.format("No tenant identifier found! Add request header: %s or request param: %s", TENANT_IDENTIFIER_REQUEST_HEADER, TENANT_IDENTIFIER_REQUEST_PARAM));
                }

                ThreadLocalContextUtil.setTenant(this.repository.findOneBySchemaName(tenantIdentifier));
            }
            chain.doFilter(request, res);
        } catch (Exception e) {
            logger.error("Error when executing request!", e);
            SecurityContextHolder.getContext().setAuthentication(null);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request!");
        } finally {
            task.stop();
            ThreadLocalContextUtil.clear();
            logger.info(PlatformRequestLog.from(task, request).toString());
        }
    }
}