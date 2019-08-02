import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule,
         MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatOptionModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { OrigenesService } from '../../configurar/origenes.service';
import { NovEquiposComponent } from './nov-equipo.component';
import { DataListNovedadModule } from '../data-list-nov/data-list-nov.module';
import { NovedadService } from '../novedad.service';


const routes: Routes = [
    {
        path: 'novedades/equipos', redirectTo: 'novedades/equipos/',
    },
    {
        path     : 'novedades/equipos/:filtro',
        component: NovEquiposComponent,
        resolve  : {            
            listOrigenes: OrigenesService,
            novedades: NovedadService,            
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

        DataListNovedadModule,
    ],
    providers      : [
        NovedadService,
        OrigenesService
    ]
})
export class NovEquiposModule
{
}
