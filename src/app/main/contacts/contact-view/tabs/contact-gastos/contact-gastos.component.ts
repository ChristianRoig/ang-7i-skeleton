import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Gasto } from 'app/main/gastos/gasto.model';
import { fuseAnimations } from '@fuse/animations';

 /* import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
 */
/* import { GastosService } from '../gastos.service';
 *//* import { GastoFormDialogComponent } from '../gastos-form/gastos-form.component';
 */
@Component({
    selector     : 'contact-gastos',
    templateUrl  : './contact-gastos.component.html',
    styleUrls    : ['./contact-gastos.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ContactGastosComponent implements OnInit, OnDestroy
{
    @Input() gastos: any;
   // dataSource: FilesDataSource | null;
  // dataSource = new MatTableDataSource<Gasto>([]);
    displayedColumns = ['avatar', 'descripcion', 'fecha', 'comprobante', 'estado', 'importe', 'buttons'];

   // displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'jobTitle'];
  //  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private

    /**
     * Constructor
     *
     * @param {GastosService} _gastosService
     * @param {MatDialog} _matDialog
     */
    constructor(
     //   private _gastosService: GastosService,
        public _matDialog: MatDialog,
        private router: Router
    )
    {
        // Set the private defaults
/*         this.dataSource.data = this.addGroups(Gastos.gastos, this.groupByColumn);
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this); */
    }



     

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
/*         this._gastosService.onContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(gastos => {
                this.gastos = gastos;
                this.checkboxes = {};
                 gastos.map(gasto => {
                    this.checkboxes[gasto.id] = false;
                }); 
            }); */
    //        this.dataSource.data = this.gastos
     //       console.log(this.dataSource.data);
     //       this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    }

/*         this._contactsService.onSelectedContactsChanged
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

        this._contactsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._contactsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._contactsService.deselectContacts();
            }); */
    

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit contact
     *
     * @param contact
     */
    editContact(gasto): void
    {
/*         this.dialogRef = this._matDialog.open(GastoFormDialogComponent, {
            panelClass: 'gasto-form-dialog',
            data      : {
                gasto: gasto,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     * /
                    case 'save':

               //         this._contactsService.updateContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     * /
                    case 'delete':

                        this.deleteGasto(gasto);

                        break;
                }
            }); */
    }

    /**
     * Delete Contact
     */
    deleteGasto(gasto): void
    {
 /*        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._gastosService.deleteContact(gasto);
            }
            this.confirmDialogRef = null;
        });
 */
    }

     verGasto(gasto: Gasto): void
    {
      this.router.navigate(['/gastos', gasto.id]);
    } 

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void
    {
/*         this._gastosService.toggleSelectedContact(contactId);
 */    }

    /**
     * Toggle star
     *
     * @param contactId
     */
    toggleStar(contactId): void
    {
/*        if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

         this._gastosService.updateUserData(this.user); */    
    }

/*     isGroup(index, item): boolean{
        return item.level;
      } */

}

/* export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * /
    constructor(
        private _gastosService: GastosService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     * /
    connect(): Observable<any[]>
    {
        return this._gastosService.onContactsChanged;
    }

    /**
     * Disconnect
     * /
    disconnect(): void
    {
    }
} */
