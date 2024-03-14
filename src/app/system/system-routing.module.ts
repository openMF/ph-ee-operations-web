import { NgModule } from '@angular/core';

/** Routing Imports */
import { Routes, RouterModule } from '@angular/router';
import { Route } from '../core/route/route.service';

/** Component Imports */
import { SystemComponent } from './system.component';
import { RolesAndPermissionsComponent } from './roles-and-permissions/roles-and-permissions.component';
import { AddRoleComponent } from './roles-and-permissions/add-role/add-role.component';
import { AuditTrailsComponent } from './audit-trails/audit-trails.component';
import { ViewAuditComponent } from './audit-trails/view-audit/view-audit.component';

/** Custom Resolvers */
import { RolesAndPermissionsResolver } from './roles-and-permissions/roles-and-permissions.resolver';
import { AuditTrailSearchTemplateResolver } from './audit-trails/audit-trail-search-template.resolver';
import { AuditTrailResolver } from './audit-trails/view-audit/audit-trail.resolver';


const routes: Routes = [
  Route.withShell([
    {
      path: 'system',
      data: { title: 'System', breadcrumb: 'System' },
      children: [
        {
          path: '',
          component: SystemComponent
        },
        {
          path: 'roles-and-permissions',
          data: { title:  'Roles and Permissions', breadcrumb: 'Roles and Permissions' },
          children: [
            {
              path: '',
              component: RolesAndPermissionsComponent,
              resolve: {
                roles: RolesAndPermissionsResolver
              }
            },
            {
              path: 'add',
              component: AddRoleComponent,
              data: { title: 'Add Role', breadcrumb: 'Add' }
            }
          ]
        },
        {
          path: 'audit-trails',
          data: { title: 'Audit Trails', breadcrumb: 'Audit Trails' },
          children: [
            {
              path: '',
              component: AuditTrailsComponent,
              resolve: {
                auditTrailSearchTemplate: AuditTrailSearchTemplateResolver
              }
            },
            {
             path: ':id',
             component: ViewAuditComponent,
             data: { title: 'View Audit', routeParamBreadcrumb: 'id' },
             resolve: {
               auditTrail: AuditTrailResolver
             }
            }
          ]
        }
      ]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    RolesAndPermissionsResolver,
    AuditTrailSearchTemplateResolver,
    AuditTrailResolver
  ]
})
export class SystemRoutingModule { }
