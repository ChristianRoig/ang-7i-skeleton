import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule,
         MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatOptionModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { OrigenesService } from '../origenes.service';
import { ColaboradoresComponent } from './equipo.component';
import { ColaboradoresService } from '../colaboradores.service';
import { ColaboradorListModule } from '../colaboradores-list/colaborador-list.module';


const routes: Routes = [
    {
        path: 'equipo', redirectTo: 'equipo/',
    },
    {
        path     : 'equipo/:equipo',
        component: ColaboradoresComponent,
        resolve  : {            
            contacts: ColaboradoresService,
            listOrigenes: OrigenesService
        }
    }
];

@NgModule({
    declarations   : [
        ColaboradoresComponent
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
        MatSelectModule,
        MatOptionModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,

        ColaboradorListModule

    ],
    providers      : [
        ColaboradoresService,
        OrigenesService
    ]
})
export class ColaboradoresModule
{
}
