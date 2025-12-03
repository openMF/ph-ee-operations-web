/** Angular Imports */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/** Custom Components */
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';

/** Custom Services */
import { AlertService } from 'app/core/alert/alert.service';
import { G2PPaymentConfigService } from '../services/g2p-payment-config.service';

/**
 * Update G2P Payment Component
 */
@Component({
  selector: 'mifosx-update-g2p-payment',
  templateUrl: './update-g2p-payment.component.html',
  styleUrls: ['./update-g2p-payment.component.scss'],
})
export class UpdateG2pPaymentComponent {
  programForm: FormGroup;
  isEditing: boolean;
  initialFormValues: any;
  programData: any;
  configTemplate: any;

  /**
   *
   * @param route ActivatedRoute
   * @param router Router
   * @param dialog MatDialog
   * @param fb FormBuilder
   * @param alertService AlertService
   * @param g2PPaymentConfigService G2PPaymentConfigService
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private alertService: AlertService,
    private g2PPaymentConfigService: G2PPaymentConfigService
  ) {
    this.route.data.subscribe((data: any) => {
      this.programData = data.program;
      this.configTemplate = data.template;
    });
  }

  ngOnInit(): void {
    this.createProgramForm();
  }

  /**
   * Create form
   */
  createProgramForm() {
    this.programForm = this.fb.group({
      governmentEntity: [{ value: this.programData.governmentEntity.name, disabled: true }, Validators.required],
      program: [{ value: this.programData.program.programName, disabled: true }, [Validators.required]],
      account: [{ value: this.programData.account, disabled: true }, [Validators.required]],
      payerDfsp: [{ value: this.programData.dfsp.name, disabled: true }, [Validators.required]],
      status: [{ value: this.programData.status, disabled: true }, [Validators.required]],
    });
    this.initialFormValues = this.programForm.getRawValue();
  }

  /**
   * Submit form data
   */
  submit() {
    if (this.programForm.valid) {
      const formData = this.programForm.getRawValue();
      // Mapping form data to update request
      const updateRequest = {
        governmentEntity: {
          govInstId: formData.governmentEntity,
        },
        dfsp: {
          fspId: formData.payerDfsp,
        },
        program: {
          programId: formData.program,
        },
        account: formData.account,
        status: formData.status,
      };

      const programId = this.route.snapshot.params['id'];
      this.g2PPaymentConfigService.updateG2pPayment(programId, updateRequest).subscribe((response) => {
        this.alertService.alert({ type: 'success', message: 'User updated successfully' });
        this.router.navigate(['dashboard/configuration/g2p-payment-config']);
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      Object.keys(this.programForm.controls).forEach((control) => {
        this.programForm.get(control).enable();
      });
    } else {
      // Reset form to initial values
      this.programForm.reset(this.initialFormValues);
      this.programForm.disable();
    }
  }

  delete() {
    const deleteUserDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `Program Configuration ${this.route.snapshot.params['id']}` },
    });
    deleteUserDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        console.log('Delete Program Config:', this.programForm.getRawValue());
        this.g2PPaymentConfigService.deleteG2pPayment(this.route.snapshot.params['id']).subscribe((response) => {
          this.alertService.alert({ type: 'success', message: 'User deleted successfully' });
          this.router.navigate(['dashboard/configuration/g2p-payment-config']);
        });
      }
    });
  }
}
