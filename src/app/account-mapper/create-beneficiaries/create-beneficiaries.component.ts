/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

/** Custom Services */
import { G2PPaymentConfigService } from "app/configuration/services/g2p-payment-config.service";
import { AccountMapperService } from "../services/account-mapper.service";

/** Router Imports */
import { Router } from "@angular/router";

/**
 * Create Beneficiaries Component
 */
@Component({
  selector: 'mifosx-create-beneficiaries',
  templateUrl: './create-beneficiaries.component.html',
  styleUrls: ['./create-beneficiaries.component.scss']
})
export class CreateBeneficiariesComponent implements OnInit {
  programForm: FormGroup;
  govtEntities: any[] = [];
  programs: any[] = [];
  dfsps: any[] = [];

  /**
   * @param {FormBuilder} fb Form builder.
   * @param {G2PPaymentConfigService} g2pPaymentService G2P Payment service.
   * @param {AccountMapperService} accountMapperService Account mapper service.
   * @param {Router} router Router.
   */
  constructor(
    private fb: FormBuilder,
    private g2pPaymentService: G2PPaymentConfigService,
    private accountMapperService: AccountMapperService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createProgramForm();
    this.loadDropdownData();
  }

  /**
   * Create the program form.
   */
  createProgramForm() {
    this.programForm = this.fb.group({
      requestId: [{ value: this.generateID(12), disabled: true }, Validators.required],
      sourceBBID: ["", Validators.required],
      payeeIdentity: ["", Validators.required],
      paymentModality: ["", Validators.required],
      financialAddress: ["", Validators.required],
      bankingInstitutionCode: ["", Validators.required],
    });
  }

  /**
   * Generate a random ID.
   * @param {number} n Number of digits.
   * @returns {string} Random ID.
   */
  generateID(n: number): string {
    const max = Math.pow(10, n);
    const min = max / 10;
    return Math.floor(Math.random() * (max - min) + min).toString();
  }
  

  /**
   * Load dropdown data.
   */
  loadDropdownData() {
    this.g2pPaymentService.getTemplateData().subscribe(
      (data: any) => {
        this.govtEntities = data.govtEntities;
        this.programs = data.programs;
        this.dfsps = data.payerDfsps;
      },
      (error: any) => {
        console.log('Error:', error);
      }
    );
  }

  /**
   * Submit the form.
   */
  submit() {
    if (this.programForm.valid) {
      const formData = this.programForm.getRawValue();
      const accountData = {
        requestID: formData.requestId,
        sourceBBID: formData.sourceBBID,
        beneficiaries: [
          {
            payeeIdentity: formData.payeeIdentity,
            paymentModality: formData.paymentModality,
            financialAddress: formData.financialAddress,
            bankingInstitutionCode: formData.bankingInstitutionCode
          }
        ]
      };

      this.accountMapperService.createAccount(accountData).subscribe(
        (response: any) => {
          //route to the program list page
          this.router.navigate(['dashboard/account-mapper/beneficiaries']);
        },
        (error: any) => {
          console.log('Error:', error);
        }
      );
    }
  }
}