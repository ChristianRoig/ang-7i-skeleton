import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { Router } from '@angular/router';
import { Perfil } from 'app/main/perfil/perfil.model';
import { NovedadFormDialogComponent } from 'app/main/novedades/nov_form/nov_form.component';
import { Combo } from 'app/main/common/combos/combo.model';


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

    @Input() comboOrigen;

    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
     * addNovedad()
     * Invoca el form de nueva novedad asignando un colaborador
     * @param {Perfil} colaborador 
     */
    addNovedad(colaborador: Perfil): void {
        const combo = new Combo(this.comboOrigen);
        
        this.dialogRef = this._matDialog.open(NovedadFormDialogComponent, {
            panelClass: 'nov-form-dialog',
            data: {
                periodo: '',
                periodos: [],
                invocador: this.invocador,
                action: 'new',
                perfil: colaborador,
                codOrigen: combo.cod,
                origen: combo.valor,
            }
        });

    }

    /**
     * goPerfil()
     * Permite re-dirigir al perfil de la persona
     * @param {Perfil} colaborador 
     */
    goPerfil(colaborador: Perfil): void {
        this.router.navigate([
            'legajo/' + colaborador.legajo                     
        ]); 
    }

}

