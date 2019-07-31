import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatMenuModule, MatTableModule, MatRippleModule, MatToolbarModule } from '@angular/material';
import { DataListNovedadComponent } from './data-list-nov.component';




@NgModule({
    declarations: [
        DataListNovedadComponent,        
    ],
    imports: [
        CommonModule,

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

    ],
    providers: [

    ],
    exports: [
        DataListNovedadComponent,        
    ],
    entryComponents: [
        
    ]
})
export class DataListNovedadModule {
}
