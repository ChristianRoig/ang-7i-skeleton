import { NgModule } from '@angular/core';
import { ContactsSelectedBarComponent } from './selected-bar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatMenuModule } from '@angular/material';

@NgModule({
    declarations: [
        ContactsSelectedBarComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
    ],
    providers: [

    ],
    exports: [
        ContactsSelectedBarComponent
    ]
})
export class SelectedBarModule {
}
