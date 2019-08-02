import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule,
         MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatOptionModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { NovedadesComponent } from 'app/main/novedades/novedades_sector/novedades.component';
// import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';

import { ConceptosService } from '../../configurar/conceptos.service';
import { NovedadService } from '../novedad.service';
// import { DataListModule } from 'app/main/common/data-list/data-list.module';


const routes: Routes = [
    {
        path: 'novedades/sectores', redirectTo: 'novedades/sectores/',
    },
    {
        path: 'novedades/sectores/:filtro',
        component: NovedadesComponent,
        resolve  : {
            novedades: NovedadService,
            conceptos: ConceptosService
        }
    }
];

@NgModule({
    declarations   : [
        NovedadesComponent
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
        NovedadService,
        ConceptosService
    ]
})
export class NovedadesModule
{
}
