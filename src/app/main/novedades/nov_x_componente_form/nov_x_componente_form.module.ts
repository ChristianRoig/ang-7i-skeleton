import { NgModule } from '@angular/core';


import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatSlideToggleModule,  } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { NovXComponenteFormDialogComponent } from './nov_x_componente_form.component';



@NgModule({
    declarations: [
        NovXComponenteFormDialogComponent      
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
        NovXComponenteFormDialogComponent    
    ],
    entryComponents: [
        NovXComponenteFormDialogComponent
    ]
})
export class NovXComponenteFormModule {
}
