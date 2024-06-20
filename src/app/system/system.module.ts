/** Angular Imports */
import { NgModule } from '@angular/core';

/** Module Imports */
import { SharedModule } from '../shared/shared.module';
import { SystemRoutingModule } from './system-routing.module';

/** Component Imports */
import { SystemComponent } from './system.component';
import { RolesAndPermissionsComponent } from './roles-and-permissions/roles-and-permissions.component';
import { AddRoleComponent } from './roles-and-permissions/add-role/add-role.component';
import { AuditTrailsComponent } from './audit-trails/audit-trails.component';
import { ViewAuditComponent } from './audit-trails/view-audit/view-audit.component';
import { ViewRoleComponent } from './roles-and-permissions/view-role/view-role.component';
import { EditRoleComponent } from './roles-and-permissions/edit-role/edit-role.component';


@NgModule({
  imports: [
    SystemRoutingModule,
    SharedModule
  ],
  declarations: [
    SystemComponent,
    RolesAndPermissionsComponent,
    AddRoleComponent,
    AuditTrailsComponent,
    ViewAuditComponent,
    ViewRoleComponent,
    EditRoleComponent,
  ],
  entryComponents: [
  ]
})
export class SystemModule { }
