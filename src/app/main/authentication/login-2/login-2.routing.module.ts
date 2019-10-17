import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login2Component } from './login-2.component';

const routes: Routes = [
    {
        path: 'auth/login',
        component: Login2Component
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Login2RoutingModule {}
