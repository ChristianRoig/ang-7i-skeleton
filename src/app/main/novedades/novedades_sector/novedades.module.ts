import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule,
         MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatOptionModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { NovedadesComponent } from 'app/main/novedades/novedades_sector/novedades.component';
import { ConceptosService } from '../../configurar/conceptos.service';
import { NovedadService } from '../novedad.service';
import { DataListNovedadModule } from '../data-list-nov/data-list-nov.module';



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

        DataListNovedadModule,

    ],
    providers      : [
        NovedadService,
        ConceptosService
    ]
})
export class NovedadesModule
{
}
