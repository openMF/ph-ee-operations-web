package org.apache.fineract.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DateUtil {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Value("${interface.timezone}")
    public String interfaceTimezone;

    public String getUTCFormat(String dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime localDateTime = LocalDateTime.parse(dateTime, formatter);
        ZoneId interfaceZone = ZoneId.of(interfaceTimezone);
        ZonedDateTime interfaceDateTime = ZonedDateTime.of(localDateTime, interfaceZone);
        ZonedDateTime gmtDateTime = interfaceDateTime.withZoneSameInstant(ZoneId.of("GMT"));
        DateTimeFormatter gmtFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String gmtDateTimeString = gmtDateTime.format(gmtFormatter);
        return gmtDateTimeString;
    }
}
