import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Router, ActivatedRoute } from '@angular/router';
import { ConceptosService } from 'app/main/configurar/conceptos.service';
import { NovedadService } from '../novedad.service';
import { DataSource } from '@angular/cdk/table';
import { FuseUtils } from '@fuse/utils';
import { NovXComponenteFormDialogComponent } from '../nov_x_componente_form/nov_x_componente_form.component';
import { ImportarFormDialogComponent } from '../importar-form/importar-form.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector     : 'sector',
    templateUrl  : './novedades.component.html',
    styleUrls: ['../../common/colaboradores.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class NovedadesComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;

    @Input() hasCheck = true;

    columnas = ['avatar', 'name', 'docket', 'sector', 'concepto', 'monto', 'buttons'];
    
    placeholder = 'Buscar por nombre legajo sector concepto o monto';

    componente = 'sector';
    sectores = [];

    seleccionado = '';

    filtroAMostrar = '';

    titulo = 'Novedades por Sector';    

    dataSource: FilesDataSource | null;
    
    periodos: any[];
    periodoSelect = '';


    dialogRefImportar: any;
    confirmDialogRefImportar: MatDialogRef<FuseConfirmDialogComponent>;

    
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {NovedadService} _novedadService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     * @param {ConceptosService} _conceptosService
     * @param {ActivatedRoute} _activeRouter
     * @param {Router} _router
     */
    constructor(
        private _novedadService: NovedadService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private _activeRouter: ActivatedRoute,
        private _router: Router,
        private _conceptosService: ConceptosService,

    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

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

        this._activeRouter.params.subscribe(params => {

            this.seleccionado = params.filtro;

            if (this.seleccionado === '' || this.seleccionado == null || this.seleccionado === ' ') {
                this.seleccionado = 'Prem-Vta';

                this._router.navigate(['novedades/sectores/' + this.seleccionado]);
            }

        });    
        
        this._novedadService.onFilterChanged.next(this.seleccionado);        

        this.sectores = this._novedadService.ComboExtRRHH;
        this._defineAMostrar();
        this._novedadService.onComboExtRRHHChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.sectores = data;
                this._defineAMostrar();
            });
            
        this.periodos = this._novedadService.ComboPeriodo;
        this._novedadService.onComboPeriodoChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
            this.periodos = data;
            this._defineDate();       
        });
        this._defineDate(); // En un futuro se usara el valor enviado por url
       

        this.dataSource = new FilesDataSource(this._novedadService);

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._novedadService.onSearchTextChanged.next(searchText);
            });
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
    
    buscarXFiltro(elemento): void {
        this.seleccionado = elemento.cod;
        this.filtroAMostrar = elemento.valor;
        
        this._router.navigate(['novedades/sectores/' + elemento.cod]);
    }
    
    private _defineDate(data?: string): void {
        if (data) {
            const pSelect = FuseUtils.filterArrayByString(this.periodos, data);
            this.periodoSelect = (this.periodos.length !== 0) ? pSelect[0].valor : '';
        } else {
            this.periodoSelect = (this.periodos.length !== 0) ? this.periodos[0].valor : ''; //El primero siempre es el Actual
        }
    }
    
    private _defineAMostrar(): void {
        const aux: any[] = FuseUtils.filterArrayByString(this.sectores, this.seleccionado);
        this.filtroAMostrar = (aux.length) ? aux[0].valor : '';        
    }

    addNovedad(): void {
        this.dialogRef = this._matDialog.open(NovXComponenteFormDialogComponent, {
            panelClass: 'NovXComponente-form-dialog',
            data: {
                periodo: this.periodoSelect,
                periodos: this.periodos,
                invocador: this.componente,
                action: 'new'
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
}


export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {NovedadService} _novedadService
     */
    constructor(
        private _novedadService: NovedadService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._novedadService.onNovedadesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
