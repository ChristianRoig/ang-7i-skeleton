import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, 
    MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatTabsModule, MatTooltipModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FusePipesModule } from '@fuse/pipes/pipes.module';

import { PersonasRoutingModule } from './personas-routing.module';
import { PersonasService } from 'app/main/personas/personas.service';

import { ContactsComponent } from 'app/main/personas/contacts.component';
import { ContactsContactListComponent } from 'app/main/personas/contact-list/contact-list.component';
import { ContactsContactFormDialogComponent } from 'app/main/personas/contact-form/contact-form.component';
import { ContactViewComponent } from './contact-view/contact-view.component';
import { ContactGastosComponent } from './contact-view/tabs/contact-gastos/contact-gastos.component';
import { ContactInfoComponent } from './contact-view/tabs/contact-info/contact-info.component';
import { PersonasImagenesComponent } from './contact-view/tabs/personas-imagenes/personas-imagenes.component';

/* const routes: Routes = [
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
]; */


@NgModule({
    declarations   : [
        ContactsComponent,
        ContactsContactListComponent,
        ContactViewComponent,
        ContactGastosComponent,
        ContactInfoComponent,
        PersonasImagenesComponent,
        ContactsContactFormDialogComponent
    ],
    imports        : [
        // RouterModule.forChild(routes),
        CommonModule,
        PersonasRoutingModule,
    
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
        MatSelectModule,
        MatTabsModule,
        MatTooltipModule,


        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        FusePipesModule
    ],
    /* providers      : [
        PersonasService
    ], */
    entryComponents: [
        ContactsContactFormDialogComponent
    ]
})
export class PersonasModule
{
}
