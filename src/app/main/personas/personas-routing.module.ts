import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonasService } from 'app/main/personas/personas.service';
import { ContactsComponent } from 'app/main/personas/contacts.component';
import { ContactViewComponent } from './contact-view/contact-view.component';

export const crudRoute: string = 'clientes';
const routes: Routes = [
    {
        path: crudRoute,
        component: ContactsComponent,
        resolve: {
            contacts: PersonasService
        }
    },
    {
        path: crudRoute + '/:id',
        component: ContactViewComponent,
        resolve: {
            contacts: PersonasService
        }
    }
];

@NgModule({
  imports:   [RouterModule.forChild(routes)],
  exports:   [RouterModule],
  providers: [PersonasService]
})
export class PersonasRoutingModule { }
