import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule,
         MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatOptionModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { OrigenesService } from '../../configurar/origenes.service';
import { ColaboradoresComponent } from './equipo.component';

import { DataListColaboradorModule } from '../data-list-col/data-list-col.module';
import { EquipoService } from './equipo.service';
import { AuthGuard } from 'app/main/authentication/auth.guard';
import { CombosService } from '../../common/combos/combos.service';

const routes: Routes = [
    {
        path: 'equipo', redirectTo: 'equipo/',
    },
    {
        path     : 'equipo/:equipo',
        data: { roles: ['RRHH', 'ResEquipo'] },
        canActivate: [AuthGuard],
        component: ColaboradoresComponent,
        resolve  : {
            combos        : CombosService,
            colaboradores : EquipoService,            
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

        DataListColaboradorModule

    ],
    providers      : [
        EquipoService,
        OrigenesService
    ]
})
export class ColaboradoresModule
{
}
