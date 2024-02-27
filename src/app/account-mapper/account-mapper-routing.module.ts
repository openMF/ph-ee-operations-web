import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from 'app/core/route/route.service';
import { AccountMapperComponent } from './account-mapper/account-mapper.component';


const routes: Routes = [
    Route.withShell([
        {
            path: 'account-mapper',
            component: AccountMapperComponent,
            data: { title: 'Account Mapper', breadcrumb: 'Account Mapper' },
            children: [
            ]
        }
    ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
    ],
})
export class AccountMapperRoutingModule { }

