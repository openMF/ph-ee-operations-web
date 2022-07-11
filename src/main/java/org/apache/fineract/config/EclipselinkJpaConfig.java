package org.apache.fineract.config;

import org.eclipse.persistence.config.PersistenceUnitProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.orm.jpa.JpaBaseConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.autoconfigure.transaction.TransactionManagerCustomizers;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.orm.jpa.vendor.AbstractJpaVendorAdapter;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.jta.JtaTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EntityScan(basePackages = "org.apache.fineract")
@EnableJpaRepositories(basePackages = "org.apache.fineract")
@EnableTransactionManagement(proxyTargetClass = true)
public class EclipselinkJpaConfig extends JpaBaseConfiguration {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    public EclipselinkJpaConfig(DataSource routingDataSource, JpaProperties properties, ObjectProvider<JtaTransactionManager> jtaTransactionManager, ObjectProvider<TransactionManagerCustomizers> transactionManagerCustomizers) {
        super(routingDataSource, properties, jtaTransactionManager, transactionManagerCustomizers);
    }

    @Override
    protected AbstractJpaVendorAdapter createJpaVendorAdapter() {
        return new EclipseLinkJpaVendorAdapter();
    }

    @Override
    protected Map<String, Object> getVendorProperties() {
        HashMap<String, Object> map = new HashMap<>();
        map.put(PersistenceUnitProperties.WEAVING, detectWeavingMode());
        map.put(PersistenceUnitProperties.DDL_GENERATION, "none");
        map.put(PersistenceUnitProperties.LOGGING_LEVEL, "INFO");
        map.put(PersistenceUnitProperties.DDL_GENERATION_MODE, "sql-script");
        map.put("eclipselink.jdbc.batch-writing", "JDBC");
        map.put("eclipselink.jdbc.batch-writing.size", "1000");
        map.put("eclipselink.cache.shared.default", "false");

        map.put("eclipselink.logging.level.sql", "INFO");
        map.put("eclipselink.logging.parameters", "true");
        map.put("eclipselink.logging.session", "true");
        map.put("eclipselink.logging.thread", "true");
        map.put("eclipselink.logging.timestamp", "false");
        return map;
    }

    private String detectWeavingMode() {
        String weavingMode = InstrumentationLoadTimeWeaver.isInstrumentationAvailable() ? "true" : "static";
        logger.debug("weaving mode is set to {}", weavingMode);
        return weavingMode;
    }
}
