package org.apache.fineract.config;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.common.exceptions.InvalidGrantException;
import org.springframework.security.oauth2.provider.error.WebResponseExceptionTranslator;
import org.springframework.stereotype.Component;

import java.util.Date;


@Component
public class AuthExceptionTranslator implements WebResponseExceptionTranslator {

    @Override
    public ResponseEntity translate(Exception e) {
        if (e instanceof InvalidGrantException) {
            JSONObject body = new JSONObject();
            body.put("timestamp", new Date().toInstant().toEpochMilli());
            body.put("status", "401");
            body.put("error", "Unauthorized");
            body.put("message", "Invalid credentials");
            body.put("path", "/oauth/token");
            return new ResponseEntity(body.toString(), HttpStatus.UNAUTHORIZED);
        } else {
            JSONObject body = new JSONObject();
            body.put("error", e.getMessage());
            return new ResponseEntity(body.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
