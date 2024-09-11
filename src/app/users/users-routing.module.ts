/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Custom Components */
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { UserRequestsComponent } from './user-requests/user-requests.component';

/** Custom Resolvers */
import { UsersResolver } from './users.resolver';
import { UsersTemplateResolver } from './users-template.resolver';
import { UserResolver } from './user.resolver';

/** Users Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'users',
      data: { breadcrumb: 'Users', title: 'Users' },
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
          data: { title: 'Create User', breadcrumb: 'Create' },
          resolve: {
            usersTemplate: UsersTemplateResolver
          }
        },
        {
          path: "user-requests",
          component: UserRequestsComponent,
          data: { title: "User Requests", breadcrumb: "User Requests" },
        },
        {
          path: ':id',
          data: { title: 'View User', breadcrumb:'View User' },
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
