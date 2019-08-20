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
import { AuthGuard } from 'app/main/authentication/auth.guard';



const routes: Routes = [
    {
        path: 'novedades/sectores', redirectTo: 'novedades/sectores/',
    },
    {
        path: 'novedades/sectores/:filtro',
        canActivate: [AuthGuard],
        component: NovedadesComponent,
        resolve  : {
            novedades: NovedadService,
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
