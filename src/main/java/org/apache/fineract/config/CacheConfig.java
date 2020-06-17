package org.apache.fineract.config;

import net.sf.ehcache.Cache;
import net.sf.ehcache.config.CacheConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@EnableCaching
@Configuration
@ConditionalOnExpression("${caching.enabled}")
public class CacheConfig {

    public static final String CACHE_USER_BY_NAME = "userByName";

    @Bean
    @Primary
    public CacheManager cacheManager()  {
        CacheConfiguration cacheConfiguration = new CacheConfiguration(CACHE_USER_BY_NAME, 1000);
        cacheConfiguration.timeToLiveSeconds(10);
        CacheConfiguration.CacheEventListenerFactoryConfiguration factory = new CacheConfiguration.CacheEventListenerFactoryConfiguration();
        factory.setClass("org.apache.fineract.config.CustomCacheEventListenerFactory");
        cacheConfiguration.addCacheEventListenerFactory(factory);

        net.sf.ehcache.CacheManager ehCacheManager = new net.sf.ehcache.CacheManager();
        ehCacheManager.addCache(new Cache(cacheConfiguration));

        return new EhCacheCacheManager(ehCacheManager);
    }
}
