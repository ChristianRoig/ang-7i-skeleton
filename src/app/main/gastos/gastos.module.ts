import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RouterModule, Routes } from '@angular/router';
import {MatSelectModule,
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatTabsModule
} from '@angular/material';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { GastoFormDialogComponent } from "./gastos-form/gastos-form.component";
import { GastosComponent } from './gastos.component';
import { GastosService } from './gastos.service';
import { GastoListComponent } from './gasto-list/gasto-list.component';
import { GastoViewComponent } from './gasto-view/gasto-view.component';
import { GastoInfoComponent } from './gasto-view/tabs/gasto-info/gasto-info.component';

const routes: Routes = [
    {
        path     : 'gastos',
        component: GastosComponent,
        resolve  : {
            contacts: GastosService
        }
    },
    {
        path :'gastos/:id',
        component : GastoViewComponent,
        resolve : {
            gastos: GastosService
        }
    }
];

@NgModule({
    declarations   : [
        GastosComponent,
        GastoListComponent,
        GastoFormDialogComponent,
        GastoViewComponent,
        GastoInfoComponent
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
        MatTabsModule,
        HttpModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        GastosService
    ],
    entryComponents: [
        GastoFormDialogComponent
    ]
})
export class GastosModule
{
}