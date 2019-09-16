import { NgModule } from '@angular/core';
import { ContactsMainSidebarComponent } from './main.component';
import { CommonModule } from '@angular/common';
import { MatDividerModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        ContactsMainSidebarComponent
    ],
    imports: [
        CommonModule,
        MatDividerModule,
        MatCheckboxModule,
        FormsModule,
        RouterModule,
        MatButtonModule,
        MatIconModule
    ],
    providers: [

    ],
    exports: [
        ContactsMainSidebarComponent
    ]
})
export class SidebarsMainModule {
}
