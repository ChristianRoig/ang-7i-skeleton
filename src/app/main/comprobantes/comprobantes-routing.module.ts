import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastosComponent } from './gastos.component';
import { GastoViewComponent } from './gasto-view/gasto-view.component';

import { ComprobantesService } from './comprobantes.service';
import { PersonasService } from '../personas/personas.service';

const routes: Routes = [
    {
        path     : 'gastos',
        component: GastosComponent,
        resolve  : {
            gastos: ComprobantesService,
            personas: PersonasService            
        }
    }, 
     {
        path      : 'gastos/:id',
        component : GastoViewComponent,
        resolve   : {
            gastos: ComprobantesService            
        }
    } 
];

@NgModule({
  imports:   [RouterModule.forChild(routes)],
  exports:   [RouterModule],
  providers: [ComprobantesService]
})
export class ComprobantesRoutingModule { }
