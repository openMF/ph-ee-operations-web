/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

/** Custom Services */
import { UsersService } from '../services/users.service';
import { KeycloakAdminService } from '../services/users-keycloak.service';
import { JbpmService } from '../services/users-jbpm.service';

/**Components */
import { SuccessDialogComponent } from 'app/shared/success-dialog/success-dialog.component';
import { User } from '../models/user.model';
import { AlertService } from 'app/core/alert/alert.service';


/**
 * Create user component.
 */
@Component({
  selector: 'mifosx-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  /** User form. */
  userForm: UntypedFormGroup;
  /** Offices data. */
  officesData: any;
  /** Roles data. */
  rolesData: any;
  /** Type of User */
  userTypes:any;
  /** FSP Ids */
  fspIds: string[];
  /** Govt Ids */
  govtIds: string[];
  /** Show FSP ID Field */
  showFspIdField = false;
  /** Show Govt ID Field */
  showGovtIdField = false;

  /**
   * Retrieves the offices and roles data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {UsersService} usersService Users Service.
   * @param {KeycloakAdminService} keycloakAdminService Keycloak Admin Service.
   * @param {JbpmService} jbpmService Jbpm Service.
   * @param {AlertService} alertService Alert Service.
   * @param {MatDialog} dialog Material Dialog.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   */
  constructor(private formBuilder: UntypedFormBuilder,
              private usersService: UsersService,
              private alertService: AlertService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.data.subscribe((data: {
        usersTemplate: any
      }) => {
        this.userTypes = data.usersTemplate.userTypes;
        this.rolesData = data.usersTemplate.availableRoles;
      });
  }

  /**
   * Creates the user form, sets the staff data and conditional controls of the user form.
   */
  ngOnInit() {
    this.createUserForm();
    this.subscribeToFieldChanges();
  }

  

  /**
   * Creates the user form.
   */
  createUserForm() {
    this.userForm = this.formBuilder.group({
      userTypes: ['', Validators.required],
      roles: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      fspID: [''],
      govtID: [''],
      username: ['', [Validators.required, Validators.pattern('^[A-Za-z][A-Za-z0-9!@#$%^&*()_+-=]*$')]],
    });
  }

  /**
   * Sets the ID field each time the user selects a new user type
   */
  onUserTypeChange(selectedUserType: string) {
    const selectedUser = this.userTypes.find((user: { name: string }) => user.name === selectedUserType);
    if (selectedUser) {
      if (selectedUser.name === 'FSP User') {
        this.showFspIdField = true;
        this.showGovtIdField = false;
        this.fspIds = selectedUser.FSPId;
        this.userForm.get('fspID');
        this.userForm.get('govtID').clearValidators();
        this.userForm.get('govtID').reset();
      } else if (selectedUser.name === 'Govt. Entity User') {
        this.showGovtIdField = true;
        this.showFspIdField = false;
        this.govtIds = selectedUser.GovtId;
        this.userForm.get('govtID');
        this.userForm.get('fspID').clearValidators();
        this.userForm.get('fspID').reset();
      } else {
        this.showFspIdField = false;
        this.showGovtIdField = false;
        this.userForm.get('fspID').clearValidators();
        this.userForm.get('govtID').clearValidators();
        this.userForm.get('fspID').reset();
        this.userForm.get('govtID').reset();
      }
      this.userForm.get('fspID').updateValueAndValidity();
      this.userForm.get('govtID').updateValueAndValidity();
    }
  }

  /**
   * Submits the user form and creates user,
   * if successful redirects to users.
   */
  submit(): void {
    if (this.userForm.valid) {
      const user = this.mapFormDataToUserData(this.userForm.value);
      this.usersService.startJBPMProcess(user).subscribe(
        () => {
          this.openSuccessDialog(user.username);
          this.userForm.reset();
          this.clearValidationErrors();
        }
      );
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.userForm.controls).forEach((field) => {
        const control = this.userForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.alertService.alert({ type: 'error', message: 'Please fill all required fields correctly.' });
    }
  }

  /**
   * Remove Validations Error from the form control
   */
  clearValidationErrors() {
    Object.keys(this.userForm.controls).forEach((field) => {
      const control = this.userForm.get(field);
      control.setErrors(null);
      control.markAsUntouched();
      control.markAsPristine(); 
    });
  }

  /**
   * Map the form data to user data
   * @param formData form data
   * @returns User
   */
  private mapFormDataToUserData(formData: any): any {
    return {
      actionType: 'CREATE',
      createdAt: new Date().toISOString(),
      email: formData.email,
      firstName: formData.firstName,
      userid: null,
      lastName: formData.lastName,
      mobileNo: formData.mobileNo,
      roles: formData.roles,
      status: 'Inactive',
      fspId: formData.fspID ? { id: formData.fspID.fspId, name: formData.fspID.name } : null,
      govtId: formData.govtID ? { id: formData.govtID.govInstId, name: formData.govtID.name } : null,
      updatedAt: new Date().toISOString(),
      userType: formData.userTypes,
      username: formData.username,
    };
  }


  /**
   * Subscribe to field changes to show validation errors
   */
  subscribeToFieldChanges() {
    Object.keys(this.userForm.controls).forEach((field) => {
      const control = this.userForm.get(field);
      control.valueChanges.subscribe(() => {
        if (control.errors) {
          control.markAsTouched();
        }
      });
    });
  }

  /**
   * Open Success Dialog
   */
  openSuccessDialog(username: any): void {
    this.dialog.open(SuccessDialogComponent, {
      width: '800px',
      height: '500px',
      data: {
        params: { username: username },
        key: 'labels.texts.UserCreated',
      },
    });
  }
}
