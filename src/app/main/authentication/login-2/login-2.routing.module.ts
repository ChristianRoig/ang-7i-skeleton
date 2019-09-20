import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login2Component } from './login-2.component';
import { CallbackComponent } from '../callback/callback.component';

const routes: Routes = [
    {
        path: 'auth/login-2',
        component: Login2Component
    },
    { path: 'callback', component: CallbackComponent },
 
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Login2RoutingModule {}
