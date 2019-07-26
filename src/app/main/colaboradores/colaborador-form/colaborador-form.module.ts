import { NgModule } from '@angular/core';

import { ColaboradoresContactFormDialogComponent } from 'app/main/colaboradores/colaborador-form/colaborador-form.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatSlideToggleModule,  } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';



@NgModule({
    declarations: [
        ColaboradoresContactFormDialogComponent        
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
        ColaboradoresContactFormDialogComponent        
    ],
    entryComponents: [
        ColaboradoresContactFormDialogComponent
    ]
})
export class ColaboradorFormModule {
}
