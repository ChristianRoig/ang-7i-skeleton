import { NgModule } from '@angular/core';


import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatSlideToggleModule,  } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { NovedadFormDialogComponent } from './nov_form.component';



@NgModule({
    declarations: [
        NovedadFormDialogComponent      
    ],
    imports: [
        CommonModule,

        MatToolbarModule,
        MatDatepickerModule,
        MatFormFieldModule,
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
        NovedadFormDialogComponent    
    ],
    entryComponents: [
        NovedadFormDialogComponent
    ]
})
export class NovFormModule {
}
