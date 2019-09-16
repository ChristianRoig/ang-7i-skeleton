import { NgModule } from '@angular/core';


import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatDatepickerModule, MatIconModule,
         MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatSlideToggleModule,  } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ExportarTXTComponent } from './exportar-txt.component';



@NgModule({
    declarations: [
        
        ExportarTXTComponent 
    ],
    imports: [
        CommonModule,

        MatToolbarModule,
        MatDatepickerModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatSlideToggleModule,

        FuseSharedModule,
    ],
    providers: [

    ],
    exports: [
        ExportarTXTComponent
        
    ],
    entryComponents: [
        ExportarTXTComponent
    ]
})
export class ExportarTXTModule {
}
