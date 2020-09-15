package org.apache.fineract.api;

import org.apache.fineract.operations.Beneficiary;
import org.apache.fineract.operations.BeneficiaryRepository;
import org.apache.fineract.organisation.user.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class BeneficiaryApi {

    @Autowired
    BeneficiaryRepository beneficiaryRepository;

    @PostMapping(path = "/beneficiary", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void create(@RequestBody Beneficiary beneficiary, HttpServletResponse response) {
        Beneficiary existing = beneficiaryRepository.findOneByCustIdentifierAndIdentifier(beneficiary.getCustIdentifier(),
                beneficiary.getIdentifier());
        if(existing == null){
            beneficiary.setId(null);
            beneficiaryRepository.save(beneficiary);
        }else{
            response.setStatus(HttpServletResponse.SC_CONFLICT);
        }
    }

    @GetMapping(path = "/beneficiary/{custIdentifier}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Beneficiary> getAllForCustomer(@PathVariable("custIdentifier") String custIdentifier, HttpServletResponse response) {
        List<Beneficiary> beneficiaries = beneficiaryRepository.findBycustIdentifier(custIdentifier);
        if(beneficiaries != null) {
            beneficiaries.forEach(b -> b.removeId());
            return beneficiaries;
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
    }

    @DeleteMapping(path = "/beneficiary/{custIdentifier}/{identifier}", produces = MediaType.TEXT_HTML_VALUE)
    public void delete(@PathVariable("custIdentifier") String custIdentifier,
                       @PathVariable("identifier") String identifier, HttpServletResponse response) {
        Beneficiary beneficiary = beneficiaryRepository.findOneByCustIdentifierAndIdentifier(custIdentifier, identifier);
        if(beneficiary != null){
            beneficiaryRepository.delete(beneficiary);
        }else{
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
