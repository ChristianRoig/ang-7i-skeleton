import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';


import { ControlNovedadesComponent } from './control-novedades.component';
import { SidebarsMainModule } from 'app/main/common/sidebars/main/sidebars-main.module';
import { DataListNovedadModule } from '../data-list-nov/data-list-nov.module';
import { NovedadService } from '../novedad.service';
import { AuthGuard } from 'app/main/authentication/auth.guard';


const routes: Routes = [
    { path: 'novedades/control', redirectTo: 'novedades/control/FavaHnos' },

    { path: 'novedades/control/GrupoFava', canActivate: [AuthGuard], component: ControlNovedadesComponent, resolve: { novedades: NovedadService } },
    { path: 'novedades/control/FavaCard',  canActivate: [AuthGuard], component: ControlNovedadesComponent, resolve: { novedades: NovedadService } },
    { path: 'novedades/control/FavaNet',   canActivate: [AuthGuard], component: ControlNovedadesComponent, resolve: { novedades: NovedadService } },
    { path: 'novedades/control/FavaHnos',  canActivate: [AuthGuard], component: ControlNovedadesComponent, resolve: { novedades: NovedadService } },            
        
];

@NgModule({
    declarations   : [
        ControlNovedadesComponent,       
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
        
        
        , DataListNovedadModule
        , SidebarsMainModule
        
 
   
    ],
    providers      : [
        // ControlNovedadesService
        NovedadService
    ]
})
export class ControlNovedadesModule
{
}
