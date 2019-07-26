import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule,
         MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { NominaComponent } from 'app/main/colaboradores/nomina/nomina.component';
import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';
import { ColaboradorListModule } from '../colaboradores-list/colaborador-list.module';
import { SidebarsMainModule } from '../sidebars/main/sidebars-main.module';
import { SelectedBarModule } from '../selected-bar/selected-bar.module';

const routes: Routes = [
    {
        path     : 'nomina', redirectTo: 'nomina/',       
    },
    {
        path     : 'nomina/:filtro', component: NominaComponent,
        resolve  : {
            contacts: ColaboradoresService
        }
    }
];

@NgModule({
    declarations   : [
        NominaComponent,       
    ],
    imports        : [
        RouterModule.forChild(routes),

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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
        
        
        , ColaboradorListModule
        , SidebarsMainModule
        , SelectedBarModule
 
   
    ],
    providers      : [
        ColaboradoresService
    ],
    exports:   [RouterModule],
})
export class NominaModule
{
}
