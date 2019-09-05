import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { NovedadService } from '../novedad.service';
import { Novedad } from '../novedad.model';
import { GeneralConfirmDialogComponent } from 'app/main/common/general-confirm-dialog/general_confirm_dialog.component';
import { NovedadFormDialogComponent } from '../nov_form/nov_form.component';


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

    @Input() periodoSelect;

    @Input() periodos;

    @Input() origen;

    selectedContacts: any[];
    checkboxes: {};

    dialogRef: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *     
     * @param {MatDialog} _matDialog
     */
    constructor(        
        public _matDialog: MatDialog,
        private router: Router,
        private _novedadService: NovedadService
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
     * borrarNovedad()
     * Se encarga de borrar una novedad
     * @param novedad 
     */
    borrarNovedad(novedad: Novedad): void {

        this.dialogRef = this._matDialog.open(GeneralConfirmDialogComponent, {
            panelClass: 'general-confirm-dialog',
            data: {
                dialogTitle: 'Borrar Novedad',
                mensaje: '¿Esta seguro que desea eliminar la novedad de ' 
                         + this._capitalizar(novedad.nombre.toLowerCase()) 
                         + ' (' + novedad.legajo + '), importe: $' + novedad.importe + '?',
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];

                console.log(actionType);

                switch (actionType) {

                    case 'aceptar':
                        // console.log('Desea eliminar');
                        if (novedad.idNovedad){
                            this._novedadService.borrarNovedad(novedad.idNovedad);
                        }

                        break;

                    case 'cancelar':
                        // console.log('NO Desea eliminar');
                        break;
                }
            });
    }


    cambiarEstado(nov: Novedad): void {
        console.log(nov);
        let actual = '';
        let nuevo = '';
        // const estados = ['CONFIRMAR', 'APROBADO'];
        if (nov.estado !== 'CONFIRMAR' && nov.estado !== 'APROBADO'){
            return;
        }

        if (nov.estado === 'CONFIRMAR'){
            actual = 'CONFIRMAR';
            nuevo = 'APROBADO';
        }else{
            actual = 'APROBADO';
            nuevo = 'CONFIRMAR';
        }

        this.dialogRef = this._matDialog.open(GeneralConfirmDialogComponent, {
            panelClass: 'general-confirm-dialog',
            data: {
                dialogTitle: 'Cambiar el Estado de la Nov.',
                mensaje: '¿Esta seguro que desea cambiar el estado de ' + actual + ' a ' + nuevo + '?',
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];                

                switch (actionType) {

                    case 'aceptar':
                        // console.log('Desea Cambiar el estado');
                        nov.estado = nuevo;

                        this._novedadService.updateNovedad(nov);
                        break;

                    case 'cancelar':
                        // console.log('NO Desea Cambiar el estado');
                        break;
                }
            });

    }


    editNovedad(nov: Novedad): void {

        // console.log(nov);

        this.dialogRef = this._matDialog.open(NovedadFormDialogComponent, {
            panelClass: 'nov-form-dialog',
            data: {
                periodo: this.periodoSelect,
                periodos: this.periodos,
                invocador: this.invocador,
                novedad: nov,
                origen: this.origen,
                action: 'edit'
            }
        });
    }




    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * capitaliza todo un string
     */
    private _capitalizar(texto: string): string {
        return texto.replace(/\b\w/g, l => l.toUpperCase());
    }

}
