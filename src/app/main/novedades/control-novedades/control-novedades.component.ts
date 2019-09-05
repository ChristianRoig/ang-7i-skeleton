import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject, Observable } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ActivatedRoute, Router } from '@angular/router';
import { NovedadService } from '../novedad.service';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/table';
import { FuseUtils } from '@fuse/utils';
import { CombosService } from '../../common/combos/combos.service';

@Component({
    selector     : 'control-novedades',
    templateUrl  : './control-novedades.component.html',
    styleUrls: ['../../common/colaboradores.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ControlNovedadesComponent implements OnInit, OnDestroy 
{
    
    // columnas = ['avatar', 'docket', 'name', 'departament', 'buttons'];

    columnas = ['avatar', 'name', 'docket', 'origen', 'concepto', 'monto', 'buttons'];

    hasCheckNomina = false;

    componente = 'ControlNovedades';

    titulo = 'Control de Novedades';

    searchInput: FormControl;

    dataSource: FilesDataSource | null; 

    placeholder = 'Buscar por legajo, nombre o departamento';

    periodos: any[];
    periodoSelect: any;
    
    // Protected
    protected _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param { FuseSidebarService } _fuseSidebarService
     * @param { MatDialog } _matDialog
     */
    constructor(
        protected _fuseSidebarService: FuseSidebarService,
        protected _matDialog: MatDialog,
        private _activeRouter: ActivatedRoute,
        private _router: Router,
        private _novedadService: NovedadService,
        private _combosService: CombosService
     )
    {

        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        
    }

    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this._novedadService);
            
        // Combo de Periodos
        this._combosService.onComboOrigenPeriodoChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.periodos = data;
                this._defineDate();
            });
        
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


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    /**
     * updateCheck()
     * Muestra o oculta la columna estado mediante el checkbox
     * @param {boolean} c 
     */
    updateCheck(c: boolean): void {
        this.hasCheckNomina = c;        

        const col = 'estado';

        const pos = this.columnas.indexOf(col);
        if ( pos >= 0){
            this.columnas.splice(pos, 1);
        }else{
            const anteultimo = this.columnas.length - 1; 
            this.columnas.splice(anteultimo, 0, col);
        }
    }

    // changeColumns(value: string): void {
    //    // No se realizan cambios de columnas 
    //    // en caso que sea necesario agregar (isFilterNov)="changeColumns($event)"
    //    // en el control-novedades.component.html en <general-main-sidebar></general-main-sidebar>    
    // }

    /**
     * filtrarXPeriodo()
     * Encargado de asignar en el NovedadService el filtro x periodo
     * @param elemento
     */
    filtrarXPeriodo(elemento): void {
        this.periodoSelect = elemento.valor;

        this._novedadService.onfilterPeriodoChanged.next(elemento.cod);
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
