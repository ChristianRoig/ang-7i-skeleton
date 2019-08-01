import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule,
         MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatOptionModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';

import { OrigenesService } from '../../configurar/origenes.service';
import { NovEquiposComponent } from './nov-equipo.component';
// import { DataListModule } from 'app/main/common/data-list/data-list.module';


const routes: Routes = [
    {
        path: 'novedades/equipos', redirectTo: 'novedades/equipos/',
    },
    {
        path     : 'novedades/equipos/:equipo',
        component: NovEquiposComponent,
        resolve  : {            
            contacts: ColaboradoresService,
            listOrigenes: OrigenesService
        }
    }
];

@NgModule({
    declarations   : [
        NovEquiposComponent
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

        // DataListModule

    ],
    providers      : [
        ColaboradoresService,
        OrigenesService
    ]
})
export class NovEquiposModule
{
}
