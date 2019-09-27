import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, 
    MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatTabsModule, MatTooltipModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FusePipesModule } from '@fuse/pipes/pipes.module';

import { ContactsComponent } from 'app/main/contacts/contacts.component';
import { ContactsService } from 'app/main/contacts/contacts.service';
import { ContactsContactListComponent } from 'app/main/contacts/contact-list/contact-list.component';
import { ContactsContactFormDialogComponent } from 'app/main/contacts/contact-form/contact-form.component';
import { ContactViewComponent } from './contact-view/contact-view.component';
import { ContactGastosComponent } from './contact-view/tabs/contact-gastos/contact-gastos.component';
import { ContactInfoComponent } from './contact-view/tabs/contact-info/contact-info.component';
import { PersonasImagenesComponent } from './contact-view/tabs/personas-imagenes/personas-imagenes.component';

const routes: Routes = [
    {
        path: 'proveedores',
        component: ContactsComponent,
        resolve: {
            contacts: ContactsService
        }
    },
    {
        path: 'proveedores/:id',
        component: ContactViewComponent,
        resolve: {
            contacts: ContactsService
        }
    }
];


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
        MatSelectModule,
        MatTabsModule,
        MatTooltipModule,


        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        FusePipesModule
    ],
    providers      : [
        ContactsService
    ],
    entryComponents: [
        ContactsContactFormDialogComponent
    ]
})
export class ContactsModule
{
}
