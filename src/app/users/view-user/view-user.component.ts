/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

/** Custom Services */
import { UsersService } from '../users.service';

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
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  /** User Data. */
  userData: any;
  amsList: any[]

  /**
   * Retrieves the user data from `resolve`.
   * @param {UsersService} usersService Users Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(private usersService: UsersService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) {
    this.route.data.subscribe((data: { user: any }) => {
      this.userData = data.user;
    });
  }

  ngOnInit() {
    this.usersService.fetchAmsList().subscribe(res => {
      this.amsList = res;
    });
  }

  /**
   * Deletes the user and redirects to users.
   */
  delete() {
    const deleteUserDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `user ${this.userData.id}` }
    });
    deleteUserDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.usersService.deleteUser(this.userData.id)
          .subscribe(() => {
            this.router.navigate(['/users']);
          });
      }
    });
  }

  /**
   * activates the user and redirects to users.
   */
  activate() {
    const activateUserDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { deleteContext: `user ${this.userData.id}`, action: 'Activate' }
    });
    activateUserDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.usersService.activateUser(this.userData.id)
          .subscribe(() => {
            this.router.navigate(['/users']);
          });
      }
    });
  }

  /**
   * edit the Currencies assigned to user and reloads data
   */
  editCurrencies() {
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'list',
        label: 'Allowed Currencies (Comma Separated)',
        type: 'text',
        required: true
      }),
    ];
    const data = {
      title: 'Assign Country Currencies',
      layout: { addButtonText: 'Save' },
      formfields: formfields
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        this.usersService.editCurrencies(this.userData.id, response.data.value.list.split(',')).subscribe(
          res => {
            this.alertService.alert({ type: 'Edit Success', message: `Edit request was successful!` });
            this.reloadCurrentUserData();
          },
          err => this.alertService.alert({ type: 'Edit Error', message: `Edit request failed` })
        );
      }
    });

  }

  /**
   * edit the Account Nos/Shops assigned to user and reloads data
   */
  editPayePartyIds() {
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'list',
        label: 'Allowed Shop/Account ID (Comma Separated)',
        type: 'text',
        required: true
      }),
    ];
    const data = {
      title: 'Assign Shop/Account ID',
      layout: { addButtonText: 'Save' },
      formfields: formfields
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        this.usersService.editPayeePartyIds(this.userData.id, response.data.value.list.split(',')).subscribe(
          res => {
            this.alertService.alert({ type: 'Edit Success', message: `Edit request was successful!` });
            this.reloadCurrentUserData();
          },
          err => this.alertService.alert({ type: 'Edit Error', message: `Edit request failed` })
        );
      }
    });

  }

  /**
   * edit the AMS assigned to user and reloads data
   */
  editPayePartyIdTypes() {
    const formfields: FormfieldBase[] = [
      new InputBase({
        controlName: 'list',
        label: 'Allowed AMS (Comma Separated)',
        type: 'text',
        required: true
      }),
    ];
    const data = {
      title: 'Assign AMS',
      subTitle:'Options: '.concat(this.amsList.map(obj => obj.id).join(',')),
      layout: { addButtonText: 'Save' },
      formfields: formfields
    };
    const editFundDialogRef = this.dialog.open(FormDialogComponent, { data });
    editFundDialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        this.usersService.editPayeePartyIdTypes(this.userData.id, response.data.value.list.split(',')).subscribe(
          res => {
            this.alertService.alert({ type: 'Edit Success', message: `Edit request was successful!` });
            this.reloadCurrentUserData();
          },
          err => this.alertService.alert({ type: 'Edit Error', message: `Edit request failed` })
        );
      }
    });

  }

  reloadCurrentUserData() {
    this.usersService.getUser(this.userData.id).subscribe((res) => {
        this.userData = res;
      });
    
  }

  /**
   * deactivate the user and redirects to users.
   */
  deactivate() {
    const deactivateUserDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { deleteContext: `user ${this.userData.id}`, action: 'Deactivate' }
    });
    deactivateUserDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.usersService.deactivateUser(this.userData.id)
          .subscribe(() => {
            this.router.navigate(['/users']);
          });
      }
    });
  }
}
