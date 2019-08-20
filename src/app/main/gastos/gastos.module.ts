import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RouterModule, Routes } from '@angular/router';
import {MatSelectModule,
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatTabsModule, MatDividerModule
} from '@angular/material';



import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

//import { GastoFormDialogComponent } from "./gastos-form/gastos-form.component";
import { GastosComponent } from './gastos.component';
import { GastosService } from './gastos.service';
import { GastoViewComponent } from './gasto-view/gasto-view.component';
import { GastoInfoComponent } from './gasto-view/tabs/gasto-info/gasto-info.component';
import { ContactsService } from '../contacts/contacts.service';
import { GastoListComponent } from './gasto-list/gasto-list.component';
import { GastoFormDialogComponent } from './gastos-form/gastos-form.component';

const routes: Routes = [
    {
        path     : 'gastos',
        component: GastosComponent,
        resolve  : {
            gastos: GastosService,
            contacts: ContactsService
        }
    }, 
     {
        path :'gastos/:id',
        component : GastoViewComponent,
        resolve : {
            gastos: GastosService,
            contacts: ContactsService
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
        MatDividerModule,
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
