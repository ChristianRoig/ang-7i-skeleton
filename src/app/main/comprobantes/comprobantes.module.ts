import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { RouterModule, Routes } from '@angular/router';
import { MatSelectModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, 
         MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatTabsModule, MatDividerModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ComprobantesRoutingModule } from './comprobantes-routing.module';
// import { ComprobantesService } from './comprobantes.service';
// import { PersonasService } from '../personas/personas.service';

import { GastosComponent } from './gastos.component';
import { GastoListComponent } from './gasto-list/gasto-list.component';
import { GastoFormDialogComponent } from './gastos-form/gastos-form.component';
import { GastoViewComponent } from './gasto-view/gasto-view.component';
// tabs
import { GastoInfoComponent } from './gasto-view/tabs/gasto-info/gasto-info.component';

/* const routes: Routes = [
    {
        path     : 'gastos',
        component: GastosComponent,
        resolve  : {
            gastos: ComprobantesService,
            contacts: PersonasService
        }
    }, 
     {
        path      : 'gastos/:id',
        component : GastoViewComponent,
        resolve   : {
            gastos: ComprobantesService,
            contacts: PersonasService
        }
    } 
]; */

@NgModule({
    declarations   : [
        GastosComponent,
        GastoListComponent,
        GastoFormDialogComponent,
        GastoViewComponent,
        GastoInfoComponent 
    ],
    imports        : [
        // RouterModule.forChild(routes),
        CommonModule,
        ComprobantesRoutingModule,

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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    /* providers      : [
        ComprobantesService
    ], */
    entryComponents: [
        GastoFormDialogComponent
    ]
})
export class ComprobantesModule
{
}
