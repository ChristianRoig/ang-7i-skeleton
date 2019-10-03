import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonasService } from 'app/main/personas/personas.service';
import { ContactsComponent } from 'app/main/personas/contacts.component';
import { ContactViewComponent } from './contact-view/contact-view.component';

const routes: Routes = [
    {
        path: 'proveedores',
        component: ContactsComponent,
        resolve: {
            contacts: PersonasService
        }
    },
    {
        path: 'proveedores/:id',
        component: ContactViewComponent,
        resolve: {
            contacts: PersonasService
        }
    }
];

export const routeName:   String = 'Proveedores';
export const routeEntity: String = 'Proveedor';

@NgModule({
  imports:   [RouterModule.forChild(routes)],
  exports:   [RouterModule],
  providers: [PersonasService]
})
export class PersonasRoutingModule { }
