import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ContactsContactFormDialogComponent } from 'app/main/personas/contact-form/contact-form.component';

import { PersonasService } from '../personas.service';
import { Contact } from '../contact.model';

@Component({
    selector: 'contacts-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ContactsContactListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    entidad: string;
    
    contacts: any;
    user: any;
    dataSource: any | null;
    displayedColumns = ['checkbox', 'avatar', 'name', 'company', 'cuit', 'address', 'email', 'phone', 'buttons'];
    // displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'jobTitle'];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {PersonasService} _personasService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _personasService: PersonasService,
        public _matDialog: MatDialog,
        private router: Router
    ) {
        this.entidad = PersonasService.ENTIDAD; 
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this._personasService);

        this._personasService.onContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contacts => {
                this.contacts = contacts;
                this.checkboxes = {};
                contacts.map(contact => {
                    this.checkboxes[contact.id] = false;
                });
            });

        /*         this._personasService.onSelectedContactsChanged
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(selectedContacts => {
                        for ( const id in this.checkboxes )
                        {
                            if ( !this.checkboxes.hasOwnProperty(id) )
                            {
                                continue;
                            }
        
                            this.checkboxes[id] = selectedContacts.includes(id);
                        }
                        this.selectedContacts = selectedContacts;
                    });
        
                this._personasService.onUserDataChanged
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(user => {
                        this.user = user;
                    });
        
                this._personasService.onFilterChanged
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(() => {
                        this._personasService.deselectContacts();
                    }); */
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    viewContact(contact: Contact) {
        this.router.navigate(['/proveedores', contact.id]);
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit contact
     *
     * @param contact
     */
    editContact(contact): void {
        this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: {
                contact: contact,
                action: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':

                        this._personasService.updateContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteContact(contact);

                        break;
                }
            });
    }
    /**
         * Delete Contact
         */
    deleteContact(contact): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = '¿Esta Seguro que desea ELIMINAR?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._personasService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void {
        this._personasService.toggleSelectedContact(contactId);
    }

    /**
     * Toggle star
     *
     * @param contactId
     */
    toggleStar(contactId): void {
        if (this.user.starred.includes(contactId)) {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else {
            this.user.starred.push(contactId);
        }

        //    this._personasService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {PersonasService} _personasService
     */
    constructor(
        private _personasService: PersonasService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._personasService.onContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
