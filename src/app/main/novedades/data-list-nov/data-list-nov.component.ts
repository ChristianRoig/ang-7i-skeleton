import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { ImportarFormDialogComponent } from '../importar-form/importar-form.component';
import { NovXComponenteFormDialogComponent } from '../nov_x_componente_form/nov_x_componente_form.component';
import { Subject } from 'rxjs';


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

    selectedContacts: any[];
    checkboxes: {};

    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // dialogRefImportar: any;
    // confirmDialogRefImportar: MatDialogRef<FuseConfirmDialogComponent>;

    // dialogRefNovedades: any;
    // confirmDialogRefNovedades: MatDialogRef<FuseConfirmDialogComponent>;

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


    // addNovedad(): void
    // {
    //     this.dialogRef = this._matDialog.open(NovXComponenteFormDialogComponent, {
    //         panelClass: 'NovXComponente-form-dialog',
    //         data      : {
    //             periodo  : this.periodoSelect,
    //             periodos : this.periodos,
    //             invocador: this.invocador,
    //             action   : 'new'
    //         }
    //     });

    //     this.dialogRef.afterClosed()
    //         .subscribe(response => {
    //             if ( !response )
    //             {
    //                 return;
    //             }
    //             const actionType: string = response[0];
    //             const formData: FormGroup = response[1];
    //             switch ( actionType )
    //             {
    //                 /**
    //                  * Save
    //                  */
    //                 case 'save':

    //            //         this..updateContact(formData.getRawValue());

    //                     break;
    //                 /**
    //                  * Delete
    //                  */
    //                 case 'delete':

    //                     // this.deleteContact(colaborador);

    //                     break;
    //             }
    //         });
    // }



    // importar(): void {
    //     this.dialogRefImportar = this._matDialog.open(ImportarFormDialogComponent, {
    //         panelClass: 'importar-form-dialog',
    //         data: {
    //             // colaborador: colaborador,
    //             // action: 'new'
    //         }
    //     });

    //     this.dialogRefImportar.afterClosed()
    //         .subscribe(response => {
    //             if (!response) {
    //                 return;
    //             }
    //             const actionType: string = response[0];
    //             const formData: FormGroup = response[1];
    //             switch (actionType) {
    //                 /**
    //                  * Save
    //                  */
    //                 case 'save':

    //                     //         this..updateContact(formData.getRawValue());

    //                     break;
    //                 /**
    //                  * Delete
    //                  */
    //                 case 'delete':

    //                     // this.deleteContact(colaborador);

    //                     break;
    //             }
    //         });
    // }
  
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
