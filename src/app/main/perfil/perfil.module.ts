import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatDividerModule, MatIconModule, MatTabsModule, MatToolbarModule, MatFormFieldModule, 
         MatSelectModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';
// tabs
import { PerfilInfoComponent } from './tabs/perfil-info/perfil-info.component';
import { PerfilInfoLegComponent } from './tabs/perfil-info-leg/perfil-info.component';
import { PerfilInfoSegComponent } from './tabs/perfil-info-seg/perfil-info.component';
import { PerfilPreferenciasComponent } from './tabs/perfil-preferencias/perfil-preferencias.component';
import { PerfilImagenesComponent } from './tabs/perfil-imagenes/perfil-imagenes.component';
import { PerfilFormDialogComponent } from './perfil-form/perfil-form.component';

@NgModule({
  declarations: [
    PerfilComponent,
    PerfilInfoComponent,
    PerfilInfoLegComponent,
    PerfilInfoSegComponent,
    PerfilPreferenciasComponent,
    PerfilImagenesComponent,
    PerfilFormDialogComponent,
  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,

    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,

    FuseSharedModule    
  ],
  entryComponents: [
    PerfilFormDialogComponent
  ]
})
export class PerfilModule { }
