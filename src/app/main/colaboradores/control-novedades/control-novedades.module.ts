import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';
import { ColaboradorListModule } from '../colaboradores-list/colaborador-list.module';
import { SidebarsMainModule } from '../sidebars/main/sidebars-main.module';
import { SelectedBarModule } from '../selected-bar/selected-bar.module';
import { ControlNovedadesComponent } from './control-novedades.component';

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
        
        
        , ColaboradorListModule
        , SidebarsMainModule
        , SelectedBarModule
 
   
    ],
    providers      : [
        ColaboradoresService
    ]
})
export class ControlNovedadesModule
{
}
