import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector     : 'general-confirm-dialog',
    templateUrl  : './general_confirm_dialog.component.html',
    styleUrls    : ['./general_confirm_dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,

}) 
export class GeneralConfirmDialogComponent
{        
    
    mensaje = '';    
    dialogTitle = '';

    /**
     * Constructor
     *
     * @param {MatDialogRef<GeneralConfirmDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<GeneralConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,        
    )
    {
        this.mensaje = _data.mensaje || 'error';
        this.dialogTitle = _data.dialogTitle || 'error';
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Forma de uso
    // -----------------------------------------------------------------------------------------------------

    /**
     * Importar     
     * import { MatDialog, MatDialogRef } from '@angular/material';
     */

    /**
     * Declarar variables
     * dialogRef: any;
     */

    /**
     * Constructor
     * private _matDialog: MatDialog,
     */


    /**
     * Metodo de invocacion
     */

    // openConfirmDialog(): void {
    //     this.dialogRef = this._matDialog.open(GeneralConfirmDialogComponent, {
    //         panelClass: 'general-confirm-dialog',
    //         data: {
    //             dialogTitle: 'Titulo a mostrar',
    //             mensaje: 'Mensaje a mostrar',                            
    //         }
    //     });

    //     this.dialogRef.afterClosed()
    //         .subscribe(response => {
    //             if (!response) {
    //                 return;
    //             }
    //             const actionType: string = response[0];
                
    //             switch (actionType) {
                    
    //                 case 'aceptar':

    //                     // accion al aceptar

    //                     break;
                    
    //                 case 'cancelar':

    //                     // accion al cancelar

    //                     break;
    //             }
    //         });
    // }
}
