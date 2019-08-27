import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatSlideToggleModule,  } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { GeneralConfirmDialogComponent } from './general_confirm_dialog.component';




@NgModule({
    declarations: [
        GeneralConfirmDialogComponent      
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
        GeneralConfirmDialogComponent    
    ],
    entryComponents: [
        GeneralConfirmDialogComponent
    ]
})
export class GeneralConfirmDialogModule {
}
