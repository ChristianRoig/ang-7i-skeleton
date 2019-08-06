import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ColaboradoresContactFormDialogComponent } from 'app/main/colaboradores/colaborador-form/colaborador-form.component';
import { Router } from '@angular/router';

import { NovedadesFormDialogComponent } from '../../novedades/novedades-form/novedad-form.component';
import { ImportarFormDialogComponent } from '../importar-form/importar-form.component';
import { Perfil } from 'app/main/perfil/perfil.model';


@Component({
    selector     : 'data-list-novedades',
    templateUrl  : './data-list-nov.component.html',
    styleUrls    : ['../../common/data-list/data-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DataListNovedadComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    colaboradores: any;
    user: any;    

    @Input() displayedColumns;

    @Input() hasCheck: boolean;

    @Input() invocador: string;

    @Input() dataSource;

    selectedContacts: any[];
    checkboxes: {};

    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    dialogRefImportar: any;
    confirmDialogRefImportar: MatDialogRef<FuseConfirmDialogComponent>;

    dialogRefNovedades: any;
    confirmDialogRefNovedades: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *     
     * @param {MatDialog} _matDialog
     */
    constructor(        
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

    /**
     * 
     *
     * @param colaborador
     */
    addNovedad(colaborador): void
    {
        this.dialogRef = this._matDialog.open(ColaboradoresContactFormDialogComponent, {
            panelClass: 'colaborador-form-dialog',
            data      : {
                colaborador: colaborador,
                action : 'new'
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
                     */
                    case 'save':

               //         this..updateContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        // this.deleteContact(colaborador);

                        break;
                }
            });
    }



    importar(): void {
        this.dialogRefImportar = this._matDialog.open(ImportarFormDialogComponent, {
            panelClass: 'importar-form-dialog',
            data: {
                // colaborador: colaborador,
                // action: 'new'
            }
        });

        this.dialogRefImportar.afterClosed()
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

                        //         this..updateContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        // this.deleteContact(colaborador);

                        break;
                }
            });
    }
  
    goPerfil(data): void {
        // console.log(data);

        this.router.navigate([
            'perfil/' + data.legajo                     
        ]); 
    }

    test(): void{
        console.log('funciona');
    }


}
