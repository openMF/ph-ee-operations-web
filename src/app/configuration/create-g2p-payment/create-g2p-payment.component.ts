import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { G2PPaymentConfigService } from "../services/g2p-payment-config.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'mifosx-create-g2p-payment',
  templateUrl: './create-g2p-payment.component.html',
  styleUrls: ['./create-g2p-payment.component.scss']
})
export class CreateG2pPaymentComponent implements OnInit {

  programForm: FormGroup;
  govtEntities: any[] = [];
  programs: any[] = [];
  payerDfsps: any[] = [];

  /**
   * @param fb FormBuilder
   * @param g2pPaymentService G2PPaymentConfigService
   * @param router Router
   * @param route ActivatedRoute
   */
  constructor(
    private fb: FormBuilder,
    private g2pPaymentService: G2PPaymentConfigService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      this.govtEntities = data.template.govtEntities;
      this.programs = data.template.programs;
      this.payerDfsps = data.template.payerDfsps;
    })
  }

  ngOnInit(): void {
    this.createProgramForm();
  }

  /**
   * Create the program form
   */
  createProgramForm() {
    this.programForm = this.fb.group({
      governmentEntity: ["", [Validators.required]],
      program: ["", [Validators.required]],
      account: ["", [Validators.required, Validators.minLength(12), Validators.pattern("^[0-9]*$")]],
      payerDfsp: ["", [Validators.required]],
      status: ["", [Validators.required]],
    });
  }

  /**
   * Submit the form
   */
  submit() {
    if (this.programForm.valid) {
      const formData = this.programForm.getRawValue();
      // Create the payload to send to the API
      const payload = {
        governmentEntity: {
          govInstId: formData.governmentEntity
        },
        dfsp: {
          fspId: formData.payerDfsp
        },
        program: {
          programId: formData.program
        },
        account: formData.account,
        status: formData.status
      };

      this.g2pPaymentService.createG2pPayment(payload).subscribe(
        (response) => {
          this.router.navigate(['dashboard/configuration/g2p-payment-config']);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
  }
}