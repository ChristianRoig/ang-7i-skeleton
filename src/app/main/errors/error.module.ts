import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { ErrorComponent } from './error.component';
import { AuthGuard } from '../authentication/auth.guard';



const routes = [
    {
        path     : 'error',
        canActivate: [AuthGuard],
        component: ErrorComponent,
    }
];

@NgModule({
    declarations: [
        ErrorComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ]
})
export class ErrorModule
{
}
