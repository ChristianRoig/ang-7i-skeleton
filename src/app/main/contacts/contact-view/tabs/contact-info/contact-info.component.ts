import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { ContactsService } from 'app/main/contacts/contacts.service';
import { Contact } from 'app/main/contacts/contact.model';

@Component({
  selector: 'contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ContactInfoComponent implements OnInit, OnDestroy
{
    @Input() proveedor : Contact;
    // Private

    /**
     * Constructor
     *
     */
    constructor(
        private _contactService: ContactsService
    )
    {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

    }
    

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {

    }
}

