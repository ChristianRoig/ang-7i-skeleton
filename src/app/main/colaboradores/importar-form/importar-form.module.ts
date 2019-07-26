import { NgModule } from '@angular/core';


import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatSlideToggleModule,  } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { ImportarFormDialogComponent } from './importar-form.component';



@NgModule({
    declarations: [
        
        ImportarFormDialogComponent 
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
        ImportarFormDialogComponent
        
    ],
    entryComponents: [
        ImportarFormDialogComponent
    ]
})
export class ImportarFormModule {
}
