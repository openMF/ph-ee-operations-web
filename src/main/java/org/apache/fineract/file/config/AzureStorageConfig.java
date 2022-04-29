package org.apache.fineract.file.config;

import com.azure.storage.blob.BlobClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureStorageConfig {

    @Value("${cloud.azure.blob.connection-string}")
    String connectionString;

    @Bean
    @ConditionalOnProperty(
            value="cloud.azure.enabled",
            havingValue = "true")
    public BlobClientBuilder getClient() {
        BlobClientBuilder client = new BlobClientBuilder();
        client.connectionString(connectionString);
        return client;
    }

}
