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

import { ColaboradoresModule } from './main/colaboradores/equipo/equipo.module';
import { ColaboradorFormModule } from './main/colaboradores/colaborador-form/colaborador-form.module';
import { NominaModule } from './main/colaboradores/nomina/nomina.module';

import { NovedadesFormModule } from './main/novedades/novedades-form/novedad-form.module';
import { ControlNovedadesModule } from './main/novedades/control-novedades/control-novedades.module';
import { NovEquiposModule } from './main/novedades/novedades_equipos/nov-equipo.module';

import { OrigenesModule } from './main/configurar/origenes/origenes.module';
import { OrigenesFormModule } from './main/configurar/ori-form/ori-form.module';
import { ConceptosModule } from './main/configurar/conceptos/conceptos.module';
import { ConceptosFormModule } from './main/configurar/conc-form/conc-form.module';

import { ErrorModule } from './main/errors/error.module';
import { ErrorService } from './main/errors/error.service';
import { LoginService } from './main/authentication/login-2/login-2.service';
import { PerfilService } from './main/perfil/perfil.service';
import { NovedadesModule } from './main/novedades/novedades_sector/novedades.module';
import { ImportarFormModule } from './main/novedades/importar-form/importar-form.module';




const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'error'
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
        ColaboradoresModule,
        NominaModule,
        
        
        OrigenesModule,
        OrigenesFormModule,
        ConceptosModule,
        

        ColaboradorFormModule,
        ConceptosFormModule,

        // ImportarFormModule,        
        // NovedadesModule,
        // ControlNovedadesModule,
        NovEquiposModule,
        // NovedadesFormModule,        

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
