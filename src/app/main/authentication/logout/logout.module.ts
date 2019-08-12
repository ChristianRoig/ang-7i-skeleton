import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '../auth.guard';
import { LogoutComponent } from './Logout.component';



const routes = [
    {
        path     : 'auth/logout',
        canActivate: [AuthGuard],
        component: LogoutComponent
    }
];

@NgModule({
    declarations: [
        LogoutComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,        
        MatIconModule,
        

        FuseSharedModule
    ]
})
export class LogoutModule
{
}
