import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ErrorComponent } from './error.component';

const routes = [
    {
        path     : 'error',
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
