package org.apache.fineract.config;

import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.ehcache.event.CacheEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class CacheEventLogger implements CacheEventListener {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void notifyElementRemoved(Ehcache ehcache, Element element) throws CacheException {
        logger.info("Cache remove {} {} {}", element.getKey(), element.getObjectValue(), element.getHitCount());
    }

    @Override
    public void notifyElementPut(Ehcache ehcache, Element element) throws CacheException {
        logger.info("Cache put {} {} {}", element.getKey(), element.getObjectValue(), element.getHitCount());
    }

    @Override
    public void notifyElementUpdated(Ehcache ehcache, Element element) throws CacheException {
        logger.info("Cache updated {} {} {}", element.getKey(), element.getObjectValue(), element.getHitCount());
    }

    @Override
    public void notifyElementExpired(Ehcache ehcache, Element element) {
        logger.info("Cache expired {} {} {}", element.getKey(), element.getObjectValue(), element.getHitCount());
    }

    @Override
    public void notifyElementEvicted(Ehcache ehcache, Element element) {
        logger.info("Cache evicted {} {} {}", element.getKey(), element.getObjectValue(), element.getHitCount());
    }

    @Override
    public void notifyRemoveAll(Ehcache ehcache) {
        logger.info("Cache removeall");
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return null;
    }

    @Override
    public void dispose() {

    }
}
