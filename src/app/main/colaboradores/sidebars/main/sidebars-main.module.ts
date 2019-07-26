import { NgModule } from '@angular/core';
import { ContactsMainSidebarComponent } from './main.component';
import { CommonModule } from '@angular/common';
import { MatDividerModule, MatCheckboxModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ContactsMainSidebarComponent
    ],
    imports: [
        CommonModule,
        MatDividerModule,
        MatCheckboxModule,
        FormsModule
    ],
    providers: [

    ],
    exports: [
        ContactsMainSidebarComponent
    ]
})
export class SidebarsMainModule {
}
