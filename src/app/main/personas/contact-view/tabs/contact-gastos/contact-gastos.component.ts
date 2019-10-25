import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Gasto } from 'app/main/comprobantes/gasto.model';
import { fuseAnimations } from '@fuse/animations';
import { GastoFormDialogComponent } from 'app/main/comprobantes/gastos-form/gastos-form.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ComprobantesService } from 'app/main/comprobantes/comprobantes.service';


@Component({
    selector     : 'contact-gastos',
    templateUrl  : './contact-gastos.component.html',
    styleUrls    : ['./contact-gastos.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ContactGastosComponent implements OnInit, OnDestroy
{
    // @Input() gastos: any;

    gastos: any;

    @Input() proveedor: any;
    displayedColumns = ['avatar', 'descripcion', 'fecha', 'comprobante', 'estado', 'importe', 'buttons'];

   
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ComprobantesService} _comprobantesService
     * @param {MatDialog} _matDialog
     */
    constructor(private _comprobantesService: ComprobantesService, public _matDialog: MatDialog, private router: Router){
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit(): void{ 

        this._comprobantesService.onGastosProveedorChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                console.log(data);
                if (data == null) {
                    this.gastos = [];
                } else {
                    console.log(data);
                    this.gastos = data;

                }
            });


        // this._personasService.onSelectedContactsChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(selectedContacts => {
        //         for (const id in this.checkboxes) {
        //             if (!this.checkboxes.hasOwnProperty(id)) {
        //                 continue;
        //             }

        //             this.checkboxes[id] = selectedContacts.includes(id);
        //         }
        //         this.selectedContacts = selectedContacts;
        //     });
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void{
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit contact
     *
     * @param contact
     */
    editGasto(gasto): void{
        this.dialogRef = this._matDialog.open(GastoFormDialogComponent, {
            panelClass: 'gasto-form-dialog',
            data: {
                action: 'edit',
                gasto: gasto,
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

                        this._comprobantesService.updateContact(formData.getRawValue(), this.proveedor);

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteGasto(gasto);

                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteGasto(gasto): void{
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = '¿Esta Seguro que desea eliminar el comprobante?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._comprobantesService.deleteGasto(gasto, this.proveedor);
            }
            this.confirmDialogRef = null;
        });
    }

    verGasto(gasto: Gasto): void{
        this.router.navigate(['/gastos', gasto.id]);
    } 

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void
    {
    /*         this._comprobantesService.toggleSelectedContact(contactId);    */
    }

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

         this._comprobantesService.updateUserData(this.user); */    
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
     * @param {PersonasService} _personasService
     * /
    constructor(
        private _comprobantesService: ComprobantesService
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
        return this._comprobantesService.onContactsChanged;
    }

    /**
     * Disconnect
     * /
    disconnect(): void
    {
    }
} */
