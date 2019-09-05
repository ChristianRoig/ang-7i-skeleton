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
import { NovedadFormDialogComponent } from '../nov_form/nov_form.component';
import { ImportarFormDialogComponent } from '../importar-form/importar-form.component';
import { GeneralConfirmDialogComponent } from 'app/main/common/general-confirm-dialog/general_confirm_dialog.component';
import { CombosService } from 'app/main/common/combos/combos.service';

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
        private _combosService: CombosService,

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
                this.seleccionado = 'Antici';

                this._router.navigate(['novedades/sectores/' + this.seleccionado]);
            }

        });    
        
        this._novedadService.onFilterChanged.next(this.seleccionado);        


        // Combo de Periodos
        this._combosService.onComboOrigenPeriodoChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.periodos = data;
                this._defineDate();
            });

        // Combo de ExtRRHH
        this._combosService.onComboOrigenExt_RRHHChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.sectores = data;
                this._defineAMostrar();
            });          

        this.dataSource = new FilesDataSource(this._novedadService);

        // Filtro x search
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * buscarXFiltro()
     * Encargado de redireccionar la url
     * @param elemento 
     */
    buscarXFiltro(elemento): void {
        this.seleccionado = elemento.cod;
        this.filtroAMostrar = elemento.valor;
        
        this._router.navigate(['novedades/sectores/' + elemento.cod]);
    }

    /**
     * filtrarXPeriodo()
     * Encargado de asignar en el NovedadService el filtro x periodo
     * @param elemento 
     */
    filtrarXPeriodo(elemento): void {
        this.periodoSelect = elemento.valor;

        this._novedadService.onfilterPeriodoChanged.next(elemento.cod);
    }
    
    /**
     * addNovedad()
     * Encargado de llamar al form para cargar una nueva novedad
     */
    addNovedad(): void {
        this.dialogRef = this._matDialog.open(NovedadFormDialogComponent, {
            panelClass: 'nov-form-dialog',
            data: {
                periodo: this.periodoSelect,
                periodos: this.periodos,
                invocador: this.componente,
                origen: this.filtroAMostrar,
                codOrigen: this.seleccionado,
                action: 'new'
            }
        });
    }

    /**
     * importar()
     * Encargado de llamar al form para importar
     */
    importar(): void {
        const auxPeriodo = FuseUtils.filterArrayByString(this.periodos, this.periodoSelect);

        this.dialogRefImportar = this._matDialog.open(ImportarFormDialogComponent, {
            panelClass: 'importar-form-dialog',
            data: {
                periodo: (auxPeriodo.length !== 0) ? auxPeriodo[0].cod : '',
                origen: this.filtroAMostrar,
            }
        });
    }

    /**
     * borrarTodos()
     * Encargado de llamar al popup para confirmar y realizar el eliminado
     */
    borrarTodos(): void {
        this.dialogRef = this._matDialog.open(GeneralConfirmDialogComponent, {
            panelClass: 'general-confirm-dialog',
            data: {
                dialogTitle: 'Borrar todas las novedades',
                mensaje: '¿Esta seguro que quiere eliminar todas las novedades del sector ' + this.filtroAMostrar + ' y periodo ' + this.periodoSelect + '?',
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
                        console.log('Desea eliminar');     
                        const aux = FuseUtils.filterArrayByString(this.periodos, this.periodoSelect);
                        
                        if (aux.length !== 0){
                            this._novedadService.borrarAllNovedades(aux[0].cod, this.seleccionado);
                        }
                        
                        break;

                    case 'cancelar':
                        console.log('NO Desea eliminar');                        
                        break;
                }
            });
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * _defineDate()
     * @param {string} data 
     */
    private _defineDate(data?: string): void { // En un futuro puede que se usara un valor enviado por url
        if (data) {
            const pSelect = FuseUtils.filterArrayByString(this.periodos, data);
            this.periodoSelect = (this.periodos.length !== 0) ? pSelect[0].valor : '';
            this._novedadService.onfilterPeriodoChanged.next((this.periodos.length !== 0) ? pSelect[0].cod : '');
        } else {
            this.periodoSelect = (this.periodos.length !== 0) ? this.periodos[0].valor : ''; // El primero siempre es el Actual
            this._novedadService.onfilterPeriodoChanged.next((this.periodos.length !== 0) ? this.periodos[0].cod : '');
        }
    }

    /**
     * _defineAMostrar()
     */
    private _defineAMostrar(): void {
        const aux: any[] = FuseUtils.filterArrayByString(this.sectores, this.seleccionado);
        this.filtroAMostrar = (aux.length) ? aux[0].valor : '';
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
