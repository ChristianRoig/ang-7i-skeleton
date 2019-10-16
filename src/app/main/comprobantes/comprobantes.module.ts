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
import { GastoPdfComponent } from './gasto-view/tabs/gasto-pdf/gasto-pdf.component';
import { FacturaComponent } from 'app/comprobantes/factura/factura.component';


import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
    declarations   : [
        GastosComponent,
        GastoListComponent,
        GastoFormDialogComponent,
        GastoViewComponent,
        GastoInfoComponent,
        GastoPdfComponent,
        FacturaComponent
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
        , PdfViewerModule
    ],
    entryComponents: [
        GastoFormDialogComponent        
    ]
})
export class ComprobantesModule
{
}
