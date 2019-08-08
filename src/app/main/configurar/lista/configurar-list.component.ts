import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { Router } from '@angular/router';

import { OrigenesService } from '../origenes.service';
import { OrigenesFormDialogComponent } from '../ori-form/ori-form.component';
import { ConceptosService } from 'app/main/configurar/conceptos.service';
import { ConceptosFormDialogComponent } from '../conc-form/conc-form.component';



@Component({
    selector     : 'configurar-list',
    templateUrl  : './configurar-list.component.html',
    styleUrls    : ['./configurar-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ConfigurarListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    colection: any;
    
    dataSource: FilesDataSourceI | FilesDataSourceII | null;

    @Input() displayedColumns;
    @Input() invocador: string;
 
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *     
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _origenesService: OrigenesService,
        private _conceptosService: ConceptosService,
        public _matDialog: MatDialog,
        private router: Router
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        
        if (this.invocador === 'origenes'){
            this.dataSource = new FilesDataSourceI(this._origenesService);

            this._origenesService.onOrigenesChanged
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(data => {
                    this.colection = data;
                });
        }

        if (this.invocador === 'conceptos') {
            this.dataSource = new FilesDataSourceII(this._conceptosService);

            this._conceptosService.onConceptosTablaChanged
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(data => {
                    this.colection = data;
                });
        }



        

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    test(): void{
        console.log('funciona');
    }

    editResponsables(origen): void {
        this.dialogRef = this._matDialog.open(OrigenesFormDialogComponent, {
            panelClass: 'editar-ori-dialog',
            data: {
                origen: origen,
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

                        //         this._colaboradoresService.updateContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        // this.deleteContact(contact);

                        break;
                }
            });
    }

    editConcepto(concepto): void {
        this.dialogRef = this._matDialog.open(ConceptosFormDialogComponent, {
            panelClass: 'editar-concepto-dialog',
            data: {
                concepto: concepto,
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

                        //         this._colaboradoresService.updateContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        // this.deleteContact(contact);

                        break;
                }
            });
    }



}

export class FilesDataSourceI extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {OrigenesService} _origenesService
     */
    constructor(
        private _origenesService: OrigenesService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._origenesService.onOrigenesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}

export class FilesDataSourceII extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ConceptosService} _conceptosService
     */
    constructor(
        private _conceptosService: ConceptosService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._conceptosService.onConceptosTablaChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
