import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';



import { ControlNovedadesComponent } from './control-novedades.component';
import { SidebarsMainModule } from 'app/main/common/sidebars/main/sidebars-main.module';
import { DataListNovedadModule } from '../data-list-nov/data-list-nov.module';


const routes: Routes = [
    {
        path: 'novedades/control', redirectTo: 'novedades/control/',
    },
    {
        path     : 'novedades/control/:filtro',
        component: ControlNovedadesComponent,
        resolve  : {
            contacts: ColaboradoresService
        }
    }
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
        ColaboradoresService
    ]
})
export class ControlNovedadesModule
{
}
