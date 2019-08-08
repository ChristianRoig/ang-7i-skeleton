import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { Login2RoutingModule } from './login-2.routing.module';
import { Login2Component } from './login-2.component';
import { LoginService } from './login.service';

@NgModule({
    declarations: [Login2Component],
    imports: [
        Login2RoutingModule,

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule
    ],
    providers: [
        LoginService
    ]
})
export class Login2Module {}
