/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.fineract.core.service;

import org.apache.commons.lang3.time.StopWatch;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Immutable data object representing platform API request used for
 * logging/debugging.
 */
public class PlatformRequestLog {

    @SuppressWarnings("unused")
    private final long startTime;
    @SuppressWarnings("unused")
    private final long totalTime;
    @SuppressWarnings("unused")
    private final String method;
    @SuppressWarnings("unused")
    private final String url;
    @SuppressWarnings("unused")
    private final Map<String, String[]> parameters;

    public static PlatformRequestLog from(final StopWatch task, final HttpServletRequest request) throws IOException {
        final String requestUrl = request.getRequestURL().toString();

        final Map<String, String[]> parameters = new HashMap<>(request.getParameterMap());
        parameters.remove("password");
        parameters.remove("_");

        return new PlatformRequestLog(task.getStartTime(), task.getTime(), request.getMethod(), requestUrl, parameters);
    }

    private PlatformRequestLog(final long startTime, final long time, final String method, final String requestUrl,
            final Map<String, String[]> parameters) {
        this.startTime = startTime;
        this.totalTime = time;
        this.method = method;
        this.url = requestUrl;
        this.parameters = parameters;
    }

    public String toString() {
        return String.format("Start: %s -- total: %s -- method: %s -- url: %s -- parameters: %s",
                startTime,
                totalTime,
                method,
                url,
                parameters.entrySet().stream()
                .map(e -> e.getKey() + " - " + String.join(",", e.getValue()))
                .collect(Collectors.joining(" # ")));
    }
}