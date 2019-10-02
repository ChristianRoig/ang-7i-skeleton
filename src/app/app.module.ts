import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { Login2Module } from './main/authentication/login-2/login-2.module';
import { MockDbService } from './mock-db/mock-db.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { PerfilModule } from './main/perfil/perfil.module';
import { PersonasModule } from './main/personas/personas.module';
import { ComprobantesModule } from './main/comprobantes/comprobantes.module';

const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'auth/login-2'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {useHash: true }),

        TranslateModule.forRoot(),

        InMemoryWebApiModule.forRoot(MockDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        Login2Module,
        PerfilModule,
        PersonasModule,
        ComprobantesModule
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
