/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Custom Components */
import { UsersComponent } from './users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ViewUserComponent } from './view-user/view-user.component';

/** Custom Resolvers */
import { UsersResolver } from './users.resolver';
import { UsersTemplateResolver } from './users-template.resolver';
import { UserResolver } from './user.resolver';

/** Users Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'users',
      data: { title: 'Users', breadcrumb: 'Users' },
      children: [
        {
          path: '',
          component: UsersComponent,
          resolve: {
            users: UsersResolver
          }
        },
        {
          path: 'create',
          component: CreateUserComponent,
          data: { title: 'Create User', breadcrumb: 'Create User' },
          resolve: {
            usersTemplate: UsersTemplateResolver
          }
        },
        {
          path: ':id',
          data: { title: 'View User', routeResolveBreadcrumb: ['user', 'username'] },
          resolve: {
            user: UserResolver
          },
          children: [
            {
              path: '',
              component: ViewUserComponent
            }
          ]
        }
      ]
    }
  ])
];

/**
 * Users Routing Module
 *
 * Configures the users routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    UsersResolver,
    UsersTemplateResolver,
    UserResolver
  ]
})
export class UsersRoutingModule { }
