import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Login2Component } from "./login-2.component";
import { CookieService } from 'ngx-cookie-service';

const routes: Routes = [
    {
        path: "auth/login-2",
        component: Login2Component
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CookieService]
})
export class Login2RoutingModule {}
