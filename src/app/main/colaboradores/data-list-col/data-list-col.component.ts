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
import { Perfil } from 'app/main/perfil/perfil.model';


@Component({
    selector     : 'data-list-colaboradores',
    templateUrl  : './data-list-col.component.html',
    styleUrls    : ['../../common/data-list/data-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DataListColaboradorComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    colaboradores: any;
    user: any;
    // dataSource: FilesDataSource | null;

    @Input() displayedColumns;

    @Input() hasCheck: boolean;

    @Input() invocador: string;

    @Input() dataSource; 


    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // dialogRefImportar: any;
    // confirmDialogRefImportar: MatDialogRef<FuseConfirmDialogComponent>;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *     
     * @param {MatDialog} _matDialog
     * @param {Router} router
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

               //         this._colaboradoresService.updateContact(formData.getRawValue());

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

    //                     //         this._colaboradoresService.updateContact(formData.getRawValue());

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
  
    goPerfil(colaborador: Perfil): void {
        this.router.navigate([
            'perfil/' + colaborador.legajo                     
        ]); 
    }

    test(): void{
        console.log('funciona');
    }


}

// export class FilesDataSource extends DataSource<any>
// {
//     /**
//      * Constructor
//      *
//      * @param {ColaboradoresService} _colaboradoresService
//      */
//     constructor(
//         private _colaboradoresService: ColaboradoresService
//     )
//     {
//         super();
//     }

//     /**
//      * Connect function called by the table to retrieve one stream containing the data to render.
//      * @returns {Observable<any[]>}
//      */
//     connect(): Observable<any[]>
//     {
//         return this._colaboradoresService.onColaboradoresChanged;
//     }

//     /**
//      * Disconnect
//      */
//     disconnect(): void
//     {
//     }
// }
