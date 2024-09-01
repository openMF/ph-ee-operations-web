/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/** Custom Services */
import { UsersService } from '../services/users.service';
import { KeycloakAdminService } from '../services/users-keycloak.service';
import { AlertService } from 'app/core/alert/alert.service';

/** Custom Components */
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { UpdatePasswordDialogComponent } from 'app/shared/update-password-dialog/update-password-dialog.component';

/**
 * View user component.
 */
@Component({
  selector: 'mifosx-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {
  /** User Data. */
  userData: any;
  /** Edit User Form */
  userForm: FormGroup;
  /** Return current edit form status */
  isEditing = false;
  /** Load User Data */
  userTemplate: any;
  /** Current User Data */
  initialFormValues: any;

  /**
   * Retrieves the user data from `resolve`.
   * @param {UsersService} usersService Users Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(
    private usersService: UsersService,
    private keycloakAdminService: KeycloakAdminService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.route.data.subscribe((data: { user: any }) => {
      this.userData = data.user;
    });
  }

  /**
   * @description Initializes the component.
   */
  ngOnInit() {
    this.editUserForm();
    this.getUserTemplate();
  }

  /**
   * @description Edit user form.
   */
  editUserForm() {
    const idValue = this.userData.attributes.fspId ? { id: this.userData.attributes.fspId, name: this.userData.attributes.fspName } :
      this.userData.attributes.govtId ? { id: this.userData.attributes.govtId, name: this.userData.attributes.govtName } :
      { id: 0, name: 'N/A' };
    const idType = this.userData.attributes.fspId ? 'fspId' : 'govtId';
    this.userForm = this.fb.group({
      userTypes: [{ value: this.userData.attributes.userType, disabled: true }, Validators.required],
      roles: [{ value: this.userData.attributes.roles, disabled: true }, [Validators.required]],
      firstName: [{ value: this.userData.firstName, disabled: true }, [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      lastName: [{ value: this.userData.lastName, disabled: true }, [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      email: [{ value: this.userData.email, disabled: true }, [Validators.required, Validators.email]],
      mobileNo: [{ value: this.userData.attributes.mobileNo, disabled: true }, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      id: [{ value: [idValue?.id,idValue?.name], disabled: true }, [Validators.required]],
      idType: [idType],
      status: [{ value: this.userData.attributes.status, disabled: true }, Validators.required],
    });

    // Store initial form values
    this.initialFormValues = this.userForm.getRawValue();
  }

  /**
   * @description Get user template data.
   */
  getUserTemplate() {
    this.usersService.getUsersTemplate().subscribe((response) => {
      this.userTemplate = response;
    });
  }

  /**
   * @description Toggles the edit mode.
   */
  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      Object.keys(this.userForm.controls).forEach((control) => {
        if (control !== 'id' && control !== 'userTypes') {
          this.userForm.get(control).enable();
        }
      });
    } else {
      // Reset form to initial values
      this.userForm.reset(this.initialFormValues);
      this.userForm.disable();
    }
  }

  /**
   * @description Saves the user data.
  */
  async save() {
    if (this.userForm.valid) {
      const updatedUser = this.mapFormDataToUser(this.userForm.getRawValue());
      updatedUser.actionType = 'UPDATE';
      try {
        await this.usersService.startJBPMProcess(updatedUser).toPromise();
        this.alertService.alert({ type: 'success', message: 'User update request submitted for approval' });
        this.toggleEdit();
        this.userForm.disable();
      } catch (error) {
        this.alertService.alert({ type: 'error', message: `Failed to submit user update request: ${error.message}` });
      }
    }
  }


  /**
   * @description Maps form data to user object.
   * @param {any} formData Form data.
   * @returns {any} User object.
   */
  private mapFormDataToUser(formData: any): any {
    const idType = this.userForm.get('idType').value;
    const user: any = {
      actionType: 'UPDATE',
      createdAt: this.userData.createdTimestamp
        ? new Date(this.userData.createdTimestamp).toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: formData.email,
      firstName: formData.firstName,
      userid: this.userData.id,
      lastName: formData.lastName,
      mobileNo: Array.isArray(formData.mobileNo) ? formData.mobileNo[0] : formData.mobileNo,
      roles: formData.roles,
      status: formData.status[0],
      userType: formData.userTypes[0],
      username: this.userData.username,
    };

    if (formData.id !== 'N/A') {
      user[idType] = { id: formData.id[0][0], name: formData.id[1][0] };
    }

    return user;
  }


  /**
   * @returns {string} Returns the label for the ID field based on the ID type.
   */
  getIdLabel(): string {
    return this.userForm.get('idType').value === 'fspId' ? 'FSP ID *' : 'GOVT ID *';
  }



  /**
   * @description Opens a dialog to update the user's password.
   */
  updatePassword() {
    const dialogRef = this.dialog.open(UpdatePasswordDialogComponent, {
      width: "400px",
      height: "400px",
    });

    dialogRef.afterClosed().subscribe(async (response: any) => {
      if (response) {
        try {
          await this.keycloakAdminService.updatePassword(this.userData.id, response.password).toPromise();
          this.alertService.alert({ type: 'success', message: 'Password updated successfully' });
          this.router.navigate(["/users"]);
        } catch (error) {
          this.alertService.alert({ type: 'error', message: 'Failed to update password' });
          console.error('Error updating password:', error);
        }
      }
    });
  }

  /**
   * @description Deletes the user and redirects to users.
   */
  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `user ${this.userData.firstName}` }
    });

    dialogRef.afterClosed().subscribe(async (response: any) => {
      if (response.delete) {
        const deleteUserData = this.mapFormDataToUser(this.userForm.getRawValue());
        deleteUserData.actionType = 'DELETE';
        try {
          await this.usersService.startJBPMProcess(deleteUserData).toPromise();
          this.alertService.alert({ type: 'success', message: 'User deletion request submitted for approval' });
        } catch (error) {
          this.alertService.alert({ type: 'error', message: `Failed to submit user deletion request: ${error.message}` });
        }
      }
    });
  }
}
