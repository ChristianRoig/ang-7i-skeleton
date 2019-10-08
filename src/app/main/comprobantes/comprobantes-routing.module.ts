import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprobantesService } from './comprobantes.service';
import { PersonasService } from '../personas/personas.service';

import { GastosComponent } from './gastos.component';
import { GastoViewComponent } from './gasto-view/gasto-view.component';

export const crudRoute: string = 'facturacion';
const routes: Routes = [
    {
        path     : crudRoute,
        component: GastosComponent,
        resolve  : {
            gastos: ComprobantesService,
            contacts: PersonasService
        }
    }, 
     {
        path      : crudRoute + '/:id',
        component : GastoViewComponent,
        resolve   : {
            gastos: ComprobantesService,
            contacts: PersonasService
        }
    } 
];

@NgModule({
  imports:   [RouterModule.forChild(routes)],
  exports:   [RouterModule],
  providers: [ComprobantesService]
})
export class ComprobantesRoutingModule { }
