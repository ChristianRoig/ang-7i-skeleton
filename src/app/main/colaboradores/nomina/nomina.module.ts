import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { NominaComponent } from 'app/main/colaboradores/nomina/nomina.component';
import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';
import { DataListColaboradorModule } from '../data-list-col/data-list-col.module';
import { SidebarsMainModule } from 'app/main/common/sidebars/main/sidebars-main.module';
import { NominaService } from './nomina.service';

// const routes: Routes = [
//     {
//         path     : 'nomina', redirectTo: 'nomina/',       
//     },
//     {
//         path     : 'nomina/:filtro', component: NominaComponent,
//         resolve  : {
//             contacts: ColaboradoresService
//         }
//     }
// ];

const routes: Routes = [
    {   path: 'nomina', redirectTo: 'nomina/GrupoFava'    },
    {
        path: 'nomina',        
        children: [
            {    path: 'GrupoFava', component: NominaComponent, resolve: { colaboradores: NominaService }    },
            {    path: 'FavaCard',  component: NominaComponent, resolve: { colaboradores: NominaService }    },
            {    path: 'FavaNet',   component: NominaComponent, resolve: { colaboradores: NominaService }    },
            {    path: 'FavaHnos',  component: NominaComponent, resolve: { colaboradores: NominaService }    },
            // {    path: 'departamentos',       component: NominaComponent, resolve: { colaboradores: NominaService }    },
            // {    path: 'sucursales',       component: NominaComponent, resolve: { colaboradores: NominaService }    },
            // {    path: 'externos',       component: NominaComponent, resolve: { colaboradores: NominaService }    },
        ]        
    }
];


@NgModule({
    declarations   : [
        NominaComponent,       
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
        
        
        , DataListColaboradorModule
        , SidebarsMainModule
        
 
   
    ],
    providers      : [
        NominaService,
    ],
    exports:   [RouterModule],
})
export class NominaModule
{
}
