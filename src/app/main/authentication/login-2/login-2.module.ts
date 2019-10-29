import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { Login2Component } from 'app/main/authentication/login-2/login-2.component';
import { Login2RoutingModule } from './login-2.routing.module';
import { LoginService } from './login-2.service';

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
