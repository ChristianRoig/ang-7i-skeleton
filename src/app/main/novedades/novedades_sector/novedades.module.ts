import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule,
         MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatOptionModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { NovedadesComponent } from 'app/main/novedades/novedades_sector/novedades.component';
import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';

import { ConceptosService } from '../../colaboradores/conceptos.service';
// import { DataListModule } from 'app/main/common/data-list/data-list.module';


const routes: Routes = [
    {
        path: 'novedades/sectores', redirectTo: 'novedades/sectores/',
    },
    {
        path: 'novedades/sectores/:filtro',
        component: NovedadesComponent,
        resolve  : {
            contacts: ColaboradoresService,
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
        ColaboradoresService,
        ConceptosService
    ]
})
export class NovedadesModule
{
}
