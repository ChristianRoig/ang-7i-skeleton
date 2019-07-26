import { NgModule } from '@angular/core';


import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatSlideToggleModule,  } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { NovedadesFormDialogComponent } from './novedad-form.component';



@NgModule({
    declarations: [
        
        NovedadesFormDialogComponent 
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
        NovedadesFormDialogComponent
        
    ],
    entryComponents: [
        NovedadesFormDialogComponent
    ]
})
export class NovedadesFormModule {
}
