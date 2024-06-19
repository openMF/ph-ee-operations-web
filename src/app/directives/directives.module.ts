/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Custom Directives */
import { HasPermissionDirective } from './has-permission/has-permission.directive';
import { HasRoleDirective } from './has-role/has-role.directive';
import { FileDragNDropDirective } from './file-drag-ndrop/file-drag-ndrop.directive';

/**
 *  Directives Module
 *
 *  All custom directives should be declared and exported here.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HasPermissionDirective, HasRoleDirective, FileDragNDropDirective],
  exports: [HasPermissionDirective, HasRoleDirective, FileDragNDropDirective]
})
export class DirectivesModule { }
