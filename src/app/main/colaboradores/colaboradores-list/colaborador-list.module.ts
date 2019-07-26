import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColaboradoresListComponent } from 'app/main/colaboradores/colaboradores-list/colaborador-list.component';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatMenuModule, MatTableModule, MatRippleModule, MatToolbarModule } from '@angular/material';


@NgModule({
    declarations: [
        ColaboradoresListComponent,        
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
        ColaboradoresListComponent,        
    ],
    entryComponents: [
        
    ]
})
export class ColaboradorListModule {
}
