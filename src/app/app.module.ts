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
import { ContactsModule } from './main/contacts/equipo/contacts.module';
import { NominaModule } from './main/contacts/nomina/nomina.module';

import { ContacFormModule } from './main/contacts/contact-form/contact-form.module';
import { NovedadesModule } from './main/contacts/novedades/novedades.module';
import { ImportarFormModule } from './main/contacts/importar-form/importar-form.module';
import { NovedadesFormModule } from './main/contacts/novedades-form/novedad-form.module';
import { ControlNovedadesModule } from './main/contacts/control-novedades/control-novedades.module';
import { OrigenesModule } from './main/configurar/origenes/origenes.module';
import { OrigenesFormModule } from './main/configurar/ori-form/ori-form.module';
import { ConceptosModule } from './main/configurar/conceptos/conceptos.module';
import { ConceptosFormModule } from './main/configurar/conc-form/conc-form.module';
import { NovEquiposModule } from './main/contacts/novedades_equipos/nov-equipo.module';
import { ErrorModule } from './main/errors/error.module';
import { ErrorService } from './main/errors/error.service';
import { LoginService } from './main/authentication/login-2/login-2.service';
import { PerfilService } from './main/perfil/perfil.service';



const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'perfil/'
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
        RouterModule.forRoot(appRoutes, {useHash : true}),

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
        ContactsModule,
        NominaModule,
        NovedadesModule,
        ControlNovedadesModule,
        OrigenesModule,
        OrigenesFormModule,
        ConceptosModule,
        NovEquiposModule,

        ContacFormModule,
        ConceptosFormModule,
        ImportarFormModule,
        NovedadesFormModule,

        ErrorModule


    ],
    providers: [
        ErrorService,
        LoginService,
        PerfilService
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
