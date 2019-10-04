import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSelectModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, 
         MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatTabsModule, MatDividerModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ComprobantesRoutingModule } from './comprobantes-routing.module';

import { GastosComponent } from './gastos.component';
import { GastoListComponent } from './gasto-list/gasto-list.component';
import { GastoFormDialogComponent } from './gastos-form/gastos-form.component';
import { GastoViewComponent } from './gasto-view/gasto-view.component';
// tabs
import { GastoInfoComponent } from './gasto-view/tabs/gasto-info/gasto-info.component';

@NgModule({
    declarations   : [
        GastosComponent,
        GastoListComponent,
        GastoFormDialogComponent,
        GastoViewComponent,
        GastoInfoComponent 
    ],
    imports        : [
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
    entryComponents: [
        GastoFormDialogComponent
    ]
})
export class ComprobantesModule
{
}
