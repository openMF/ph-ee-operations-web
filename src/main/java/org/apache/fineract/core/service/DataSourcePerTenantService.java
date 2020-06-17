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

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.apache.fineract.organisation.tenant.TenantServerConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;


@Service
public class DataSourcePerTenantService implements DisposableBean {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final Map<Long, DataSource> tenantToDataSourceMap = new HashMap<>();

    @Value("${fineract.datasource.core.port}")
    private int defaultPort;

    @Value("${fineract.datasource.core.host}")
    private String defaultHostname;

    @Value("${fineract.datasource.core.schema}")
    private String defaultSchema;

    @Value("${fineract.datasource.core.username}")
    private String defaultUsername;

    @Value("${fineract.datasource.core.password}")
    private String defaultPassword;

    @Value("${fineract.datasource.common.protocol}")
    private String jdbcProtocol;

    @Value("${fineract.datasource.common.subprotocol}")
    private String jdbcSubprotocol;

    @Value("${fineract.datasource.common.driverclass_name}")
    private String driverClass;

    public DataSource retrieveDataSource() {
        DataSource tenantDataSource;

        final TenantServerConnection tenant = ThreadLocalContextUtil.getTenant();
        if (tenant != null) {
            synchronized (this.tenantToDataSourceMap) {
                if (this.tenantToDataSourceMap.containsKey(tenant.getId())) {
                    tenantDataSource = this.tenantToDataSourceMap.get(tenant.getId());
                } else {
                    tenantDataSource = createNewDataSourceFor(tenant);
                    this.tenantToDataSourceMap.put(tenant.getId(), tenantDataSource);
                }
            }
        } else {
            synchronized (this.tenantToDataSourceMap) {
                long defaultConnectionKey = 0;
                if (this.tenantToDataSourceMap.containsKey(defaultConnectionKey)) {
                    tenantDataSource = this.tenantToDataSourceMap.get(defaultConnectionKey);
                } else {
                    TenantServerConnection defaultConnection = new TenantServerConnection();
                    defaultConnection.setSchemaServer(defaultHostname);
                    defaultConnection.setSchemaServerPort(String.valueOf(defaultPort));
                    defaultConnection.setSchemaName(defaultSchema);
                    defaultConnection.setSchemaUsername(defaultUsername);
                    defaultConnection.setSchemaPassword(defaultPassword);
                    tenantDataSource = createNewDataSourceFor(defaultConnection);
                    this.tenantToDataSourceMap.put(defaultConnectionKey, tenantDataSource);
                }
            }
        }

        return tenantDataSource;
    }

    private DataSource createNewDataSourceFor(TenantServerConnection tenant) {
        HikariConfig config = new HikariConfig();
        config.setUsername(tenant.getSchemaUsername());
        config.setPassword(tenant.getSchemaPassword());
        config.setJdbcUrl(createJdbcUrl(jdbcProtocol, jdbcSubprotocol, tenant.getSchemaServer(),
                Integer.parseInt(tenant.getSchemaServerPort()), tenant.getSchemaName()));
        config.setAutoCommit(false);
        config.setConnectionInitSql("SELECT 1");
        config.setValidationTimeout(30000);
        config.setConnectionTestQuery("SELECT 1");
        config.setConnectionTimeout(30000);
        config.setDriverClassName(driverClass);
        config.setIdleTimeout(600000);
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setPoolName(tenant.getSchemaName() + "Pool");
        return new HikariDataSource(config);
    }

    private String createJdbcUrl(String jdbcProtocol, String jdbcSubprotocol, String hostname, int port, String dbName) {
        return new StringBuilder()
                .append(jdbcProtocol)
                .append(':')
                .append(jdbcSubprotocol)
                .append("://")
                .append(hostname)
                .append(':')
                .append(port)
                .append('/')
                .append(dbName)
                .toString();
    }

    @Override
    public void destroy() {
        for (Map.Entry<Long, DataSource> entry : this.tenantToDataSourceMap.entrySet()) {
            HikariDataSource ds = (HikariDataSource) entry.getValue();
            ds.close();
            logger.info("Datasource closed: {}", ds.getPoolName());
        }
    }
}