import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';

import { MatButtonModule, MatDividerModule, MatIconModule, MatTabsModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { PerfilInfoComponent } from './tabs/perfil-info/perfil-info.component';
import { PerfilInfoLegComponent } from './tabs/perfil-info-leg/perfil-info.component';
import { PerfilInfoSegComponent } from './tabs/perfil-info-seg/perfil-info.component';
import { PerfilPreferenciasComponent } from './tabs/perfil-preferencias/perfil-preferencias.component';
import { PerfilImagenesComponent } from './tabs/perfil-imagenes/perfil-imagenes.component';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PerfilComponent,
    PerfilInfoComponent,
    PerfilInfoLegComponent,
    PerfilInfoSegComponent,
    PerfilPreferenciasComponent,
    PerfilImagenesComponent
  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,

    FuseSharedModule,
    TranslateModule    
  ]
})
export class PerfilModule { }
