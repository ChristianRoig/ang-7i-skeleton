import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatMenuModule, MatTableModule, MatRippleModule, MatToolbarModule } from '@angular/material';
import { DataListColaboradorComponent } from './data-list-col.component';



@NgModule({
    declarations: [
        DataListColaboradorComponent,        
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
        DataListColaboradorComponent,        
    ],
    entryComponents: [
        
    ]
})
export class DataListColaboradorModule {
}
