/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

/** Custom Services */
import { UsersService } from '../users.service';
import { MatomoService } from 'app/core/analytics/matomo.service';

/** Custom Components */
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';
import { AlertService } from 'app/core/alert/alert.service';

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
  amsList: any[];

  /**
   * Retrieves the user data from `resolve`.
   * @param {UsersService} usersService Users Service.
   * @param {AlertService} alertService Alert Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   * @param {MatomoService} matomoService Matomo Analytics Service.
   */
  constructor(
    private usersService: UsersService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private matomoService: MatomoService
  ) {
    this.route.data.subscribe((data: { user: any }) => {
      this.userData = data.user;
    });
  }

  ngOnInit() {
    // Track page view
    this.matomoService.trackPageView(`View User ${this.userData.id}`);

    // Track additional page context
    this.matomoService.trackEvent(
      'User Management',
      'View User',
      `User ID: ${this.userData.id}`,
      1
    );

    // Track user status for analytics
    this.matomoService.trackEvent(
      'User Management',
      'User Status',
      this.userData.enabled ? 'Enabled' : 'Disabled',
      1
    );

    this.usersService.fetchAmsList().subscribe((res) => {
      this.amsList = res;
    });
  }

  /**
   * Deletes the user and redirects to users.
   */
  delete() {
    const deleteUserDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `user ${this.userData.id}` },
    });
    deleteUserDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        // Track user deletion action
        this.matomoService.trackEvent(
          'User Management',
          'Delete User',
          `User ID: ${this.userData.id}`,
          1
        );

        this.usersService.deleteUser(this.userData.id).subscribe(() => {
          // Track successful deletion
          this.matomoService.trackEvent(
            'User Management',
            'Delete Success',
            `User ID: ${this.userData.id}`,
            1
          );
          this.router.navigate(['/users']);
        });
      } else {
        // Track deletion cancellation
        this.matomoService.trackEvent(
          'User Management',
          'Delete Cancelled',
          `User ID: ${this.userData.id}`,
          1
        );
      }
    });
  }

  /**
   * activates the user and redirects to users.
   */
  activate() {
    const activateUserDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { deleteContext: `user ${this.userData.id}`, action: 'Activate' },
    });
    activateUserDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        // Track user activation action
        this.matomoService.trackEvent(
          'User Management',
          'Activate User',
          `User ID: ${this.userData.id}`,
          1
        );

        this.usersService.activateUser(this.userData.id).subscribe(() => {
          // Track successful activation
          this.matomoService.trackEvent(
            'User Management',
            'Activate Success',
            `User ID: ${this.userData.id}`,
            1
          );
          this.router.navigate(['/users']);
        });
      } else {
        // Track activation cancellation
        this.matomoService.trackEvent(
          'User Management',
          'Activate Cancelled',
          `User ID: ${this.userData.id}`,
          1
        );
      }
    });
  }

  /**
   * edit the Currencies assigned to user and reloads data
   */
  editCurrencies() {
    // Track currency edit dialog opening
    this.matomoService.trackEvent(
      'User Configuration',
      'Edit Currencies Dialog',
      `User ID: ${this.userData.id}`,
      1
    );

    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'list',
        label: 'Allowed Currencies (Comma Separated)',
        type: 'text',
        required: true,
      }),
    ];
    const data = {
      title: 'Assign Country Currencies',
      layout: { addButtonText: 'Save' },
      formfields: formfields,
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        // Track currency edit submission
        this.matomoService.trackEvent(
          'User Configuration',
          'Update Currencies',
          `User ID: ${this.userData.id}`,
          1
        );

        this.usersService
          .editCurrencies(this.userData.id, response.data.value.list.split(','))
          .subscribe(
            (res) => {
              // Track successful currency update
              this.matomoService.trackEvent(
                'User Configuration',
                'Currencies Updated',
                `User ID: ${this.userData.id}`,
                1
              );
              this.alertService.alert({
                type: 'Edit Success',
                message: `Edit request was successful!`,
              });
              this.reloadCurrentUserData();
            },
            (err) => {
              // Track currency update failure
              this.matomoService.trackEvent(
                'User Configuration',
                'Currencies Update Failed',
                `User ID: ${this.userData.id}`,
                1
              );
              this.alertService.alert({
                type: 'Edit Error',
                message: `Edit request failed`,
              });
            }
          );
      } else {
        // Track currency edit cancellation
        this.matomoService.trackEvent(
          'User Configuration',
          'Edit Currencies Cancelled',
          `User ID: ${this.userData.id}`,
          1
        );
      }
    });
  }

  /**
   * edit the Account Nos/Shops assigned to user and reloads data
   */
  editPayePartyIds() {
    // Track Shop/Account ID edit dialog opening
    this.matomoService.trackEvent(
      'User Configuration',
      'Edit Shop/Account ID Dialog',
      `User ID: ${this.userData.id}`,
      1
    );

    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'list',
        label: 'Allowed Shop/Account ID (Comma Separated)',
        type: 'text',
        required: true,
      }),
    ];
    const data = {
      title: 'Assign Shop/Account ID',
      layout: { addButtonText: 'Save' },
      formfields: formfields,
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        // Track Shop/Account ID edit submission
        this.matomoService.trackEvent(
          'User Configuration',
          'Update Shop/Account ID',
          `User ID: ${this.userData.id}`,
          1
        );

        this.usersService
          .editPayeePartyIds(
            this.userData.id,
            response.data.value.list.split(',')
          )
          .subscribe(
            (res) => {
              // Track successful Shop/Account ID update
              this.matomoService.trackEvent(
                'User Configuration',
                'Shop/Account ID Updated',
                `User ID: ${this.userData.id}`,
                1
              );
              this.alertService.alert({
                type: 'Edit Success',
                message: `Edit request was successful!`,
              });
              this.reloadCurrentUserData();
            },
            (err) => {
              // Track Shop/Account ID update failure
              this.matomoService.trackEvent(
                'User Configuration',
                'Shop/Account ID Update Failed',
                `User ID: ${this.userData.id}`,
                1
              );
              this.alertService.alert({
                type: 'Edit Error',
                message: `Edit request failed`,
              });
            }
          );
      } else {
        // Track Shop/Account ID edit cancellation
        this.matomoService.trackEvent(
          'User Configuration',
          'Edit Shop/Account ID Cancelled',
          `User ID: ${this.userData.id}`,
          1
        );
      }
    });
  }

  /**
   * edit the AMS assigned to user and reloads data
   */
  editPayePartyIdTypes() {
    // Track AMS edit dialog opening
    this.matomoService.trackEvent(
      'User Configuration',
      'Edit AMS Dialog',
      `User ID: ${this.userData.id}`,
      1
    );

    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'list',
        label: 'Allowed AMS (Comma Separated)',
        type: 'text',
        required: true,
      }),
    ];
    const data = {
      title: 'Assign AMS',
      subTitle: 'Options: '.concat(this.amsList.map((obj) => obj.id).join(',')),
      layout: { addButtonText: 'Save' },
      formfields: formfields,
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        // Track AMS edit submission
        this.matomoService.trackEvent(
          'User Configuration',
          'Update AMS',
          `User ID: ${this.userData.id}`,
          1
        );

        this.usersService
          .editPayeePartyIdTypes(
            this.userData.id,
            response.data.value.list.split(',')
          )
          .subscribe(
            (res) => {
              // Track successful AMS update
              this.matomoService.trackEvent(
                'User Configuration',
                'AMS Updated',
                `User ID: ${this.userData.id}`,
                1
              );
              this.alertService.alert({
                type: 'Edit Success',
                message: `Edit request was successful!`,
              });
              this.reloadCurrentUserData();
            },
            (err) => {
              // Track AMS update failure
              this.matomoService.trackEvent(
                'User Configuration',
                'AMS Update Failed',
                `User ID: ${this.userData.id}`,
                1
              );
              this.alertService.alert({
                type: 'Edit Error',
                message: `Edit request failed`,
              });
            }
          );
      } else {
        // Track AMS edit cancellation
        this.matomoService.trackEvent(
          'User Configuration',
          'Edit AMS Cancelled',
          `User ID: ${this.userData.id}`,
          1
        );
      }
    });
  }

  /**
   * change a user's password
   */
  changePassword() {
    // Track password change dialog opening
    this.matomoService.trackEvent(
      'User Management',
      'Change Password Dialog',
      `User ID: ${this.userData.id}`,
      1
    );

    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'password',
        label: 'New User Password',
        type: 'password',
        required: true,
      }),
    ];
    const data = {
      title: 'Change User Password',
      layout: { addButtonText: 'Save' },
      formfields: formfields,
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        // Track password change submission
        this.matomoService.trackEvent(
          'User Management',
          'Change Password',
          `User ID: ${this.userData.id}`,
          1
        );

        const appUser = {
          ...this.userData,
          password: response.data.value.password,
        };
        this.usersService.editUserDetails(this.userData.id, appUser).subscribe(
          (res) => {
            // Track successful password change
            this.matomoService.trackEvent(
              'User Management',
              'Password Changed',
              `User ID: ${this.userData.id}`,
              1
            );
            this.alertService.alert({
              type: 'Edit Success',
              message: `Change User Password Request was successful!`,
            });
            this.reloadCurrentUserData();
          },
          (err) => {
            // Track password change failure
            this.matomoService.trackEvent(
              'User Management',
              'Password Change Failed',
              `User ID: ${this.userData.id}`,
              1
            );
            this.alertService.alert({
              type: 'Edit Error',
              message: `Change User Password request failed`,
            });
          }
        );
      } else {
        // Track password change cancellation
        this.matomoService.trackEvent(
          'User Management',
          'Change Password Cancelled',
          `User ID: ${this.userData.id}`,
          1
        );
      }
    });
  }
  /**
   * edit user details, can add more if needed
   */
  editAppUser() {
    // Track user details edit dialog opening
    this.matomoService.trackEvent(
      'User Management',
      'Edit User Details Dialog',
      `User ID: ${this.userData.id}`,
      1
    );

    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
      }),
      new InputBase({
        controlName: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
      }),
    ];
    const data = {
      title: 'Edit User Details',
      layout: { addButtonText: 'Save' },
      formfields: formfields,
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        // Track user details edit submission
        this.matomoService.trackEvent(
          'User Management',
          'Update User Details',
          `User ID: ${this.userData.id}`,
          1
        );

        const appUser = {
          ...this.userData,
          firstname: response.data.value.firstName,
          lastname: response.data.value.lastName,
        };
        this.usersService.editUserDetails(this.userData.id, appUser).subscribe(
          (res) => {
            // Track successful user details update
            this.matomoService.trackEvent(
              'User Management',
              'User Details Updated',
              `User ID: ${this.userData.id}`,
              1
            );
            this.alertService.alert({
              type: 'Edit Success',
              message: `Edit User Request was successful!`,
            });
            this.reloadCurrentUserData();
          },
          (err) => {
            // Track user details update failure
            this.matomoService.trackEvent(
              'User Management',
              'User Details Update Failed',
              `User ID: ${this.userData.id}`,
              1
            );
            this.alertService.alert({
              type: 'Edit Error',
              message: `Edit User request failed`,
            });
          }
        );
      } else {
        // Track user details edit cancellation
        this.matomoService.trackEvent(
          'User Management',
          'Edit User Details Cancelled',
          `User ID: ${this.userData.id}`,
          1
        );
      }
    });
  }

  reloadCurrentUserData() {
    // Track data reload for analytics
    this.matomoService.trackEvent(
      'User Management',
      'Reload User Data',
      `User ID: ${this.userData.id}`,
      1
    );

    this.usersService.getUser(this.userData.id).subscribe((res) => {
      this.userData = res;
    });
  }

  /**
   * deactivate the user and redirects to users.
   */
  deactivate() {
    const deactivateUserDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { deleteContext: `user ${this.userData.id}`, action: 'Deactivate' },
    });
    deactivateUserDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        // Track user deactivation action
        this.matomoService.trackEvent(
          'User Management',
          'Deactivate User',
          `User ID: ${this.userData.id}`,
          1
        );

        this.usersService.deactivateUser(this.userData.id).subscribe(() => {
          // Track successful deactivation
          this.matomoService.trackEvent(
            'User Management',
            'Deactivate Success',
            `User ID: ${this.userData.id}`,
            1
          );
          this.router.navigate(['/users']);
        });
      } else {
        // Track deactivation cancellation
        this.matomoService.trackEvent(
          'User Management',
          'Deactivate Cancelled',
          `User ID: ${this.userData.id}`,
          1
        );
      }
    });
  }
}
