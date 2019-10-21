import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, 
    MatRippleModule, MatTableModule, MatToolbarModule, MatSelectModule, MatTabsModule, MatTooltipModule, MatDividerModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FusePipesModule } from '@fuse/pipes/pipes.module';

import { PersonasRoutingModule } from './personas-routing.module';

import { ContactsComponent } from 'app/main/personas/contacts.component';
import { ContactsContactListComponent } from 'app/main/personas/contact-list/contact-list.component';
import { ContactsContactFormDialogComponent } from 'app/main/personas/contact-form/contact-form.component';
import { ContactViewComponent } from './contact-view/contact-view.component';
// tabs
import { ContactGastosComponent } from './contact-view/tabs/contact-gastos/contact-gastos.component';
import { ContactInfoComponent } from './contact-view/tabs/contact-info/contact-info.component';
import { PersonasImagenesComponent } from './contact-view/tabs/personas-imagenes/personas-imagenes.component';

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
        MatDividerModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        FusePipesModule
    ],
    entryComponents: [
        ContactsContactFormDialogComponent
    ]
})
export class PersonasModule
{
}
