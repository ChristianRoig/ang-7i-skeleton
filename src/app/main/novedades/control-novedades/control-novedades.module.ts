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


const routes: Routes = [
    { path: 'novedades/control', redirectTo: 'novedades/control/GrupoFava' },

    { path: 'novedades/control/GrupoFava', component: ControlNovedadesComponent, resolve: { novedades: NovedadService } },
    { path: 'novedades/control/FavaCard', component: ControlNovedadesComponent, resolve: { novedades: NovedadService } },
    { path: 'novedades/control/FavaNet', component: ControlNovedadesComponent, resolve: { novedades: NovedadService } },
    { path: 'novedades/control/FavaHnos', component: ControlNovedadesComponent, resolve: { novedades: NovedadService } },            
        
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
