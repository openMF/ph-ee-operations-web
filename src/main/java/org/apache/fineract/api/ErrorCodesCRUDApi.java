package org.apache.fineract.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.fineract.operations.ErrorCode;
import org.apache.fineract.operations.ErrorCodeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/errorcode")
public class ErrorCodesCRUDApi {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ErrorCodeRepository errorCodesRepository;

    @PostMapping("/")
    public ErrorCode addErrorCode(@RequestBody ErrorCode errorCode) {
        ErrorCode response = errorCodesRepository.save(errorCode);
        return response;
    }

    @GetMapping("/")
    public List<ErrorCode> getAllErrorCode() {
        List<ErrorCode> errorCodes = new ArrayList<>();
        errorCodesRepository.findAll().forEach(errorCodes::add);
        return errorCodes;
    }

    @GetMapping("/{id}")
    public ErrorCode getSpecificErrorCode(@PathVariable Long id) {
        return errorCodesRepository.findById(id).get();
    }

    @GetMapping("/filter")
    public List<ErrorCode> getErrorCodeByFilter(@RequestParam("by") String filterType, @RequestParam("value") Object value) {
        switch (filterType){
            case "errorCode":
                return errorCodesRepository.getErrorCodesByErrorCode(value.toString());
            case "recoverable":
                boolean option = value.toString().equals("true");
                return errorCodesRepository.getErrorCodesByRecoverable(option);
            case "transactionType":
                return errorCodesRepository.getErrorCodesByTransactionType(value.toString());
            default:
                return null;
        }
    }

    @PutMapping("/{id}")
    public ErrorCode updateErrorCode(@PathVariable Long id, @RequestBody ErrorCode errorCode) {
        errorCode.setId(id);
        ErrorCode response = errorCodesRepository.save(errorCode);
        return response;
    }

    @DeleteMapping("/{id}")
    public ErrorCode deleteErrorCode(@PathVariable Long id) {
        ErrorCode errorCode = getSpecificErrorCode(id);
        errorCodesRepository.deleteById(id);
        return errorCode;
    }
}
