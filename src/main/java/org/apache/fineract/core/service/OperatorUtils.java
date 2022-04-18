package org.apache.fineract.core.service;

import java.text.SimpleDateFormat;

public class OperatorUtils {

    public static String strip(String str) {
        return str.replaceAll("^\"|\"$", "");
    }

    public static SimpleDateFormat dateFormat() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }
}
