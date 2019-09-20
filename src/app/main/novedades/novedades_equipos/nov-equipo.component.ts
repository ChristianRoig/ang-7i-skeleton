import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { OrigenesService } from '../../configurar/origenes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { NovedadService } from '../novedad.service';
import { FuseUtils } from '@fuse/utils';
import { NovedadFormDialogComponent } from '../nov_form/nov_form.component';
import { CombosService } from '../../common/combos/combos.service';


@Component({
    selector     : 'novequipos',
    templateUrl  : './nov-equipo.component.html',
    styleUrls: ['../../common/colaboradores.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
}) 
export class NovEquiposComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;

    @Input() hasCheck = true;

    columnas = ['avatar', 'name', 'docket', 'departament', 'concepto', 'monto',  'buttons'];

    listOrigenes = [];

    seleccionado = '';

    filtroAMostrar: any;

    componente = 'nov-equipos';

    titulo = 'Novedades de Equipos';    

    dataSource: FilesDataSource | null;

    periodos: any[];
    periodoSelect: any;

    placeholder = 'Buscar por nombre legajo departamento concepto o monto';
    
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {NovedadService} _novedadService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     * @param {OrigenesService} _origenesService
     * @param {ActivatedRoute} _activeRouter
     * @param {Router} _router
     */
    constructor(
        private _novedadService: NovedadService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private _origenesService: OrigenesService,
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
        });    
        
        // this._novedadService.onFilterChanged.next(this.seleccionado);

        // Combo de Origenes
        this._combosService.onComboOrigenDep_SucChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.listOrigenes = data;
                this._defineAMostrar();
            });

        // Combo de Periodos
        this._combosService.onComboOrigenPeriodoChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.periodos = data;
                this._defineDate();
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

        this._router.navigate(['novedades/equipos/' + elemento.cod]);
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
        const aux: any[] = FuseUtils.filterArrayByString(this.listOrigenes, this.seleccionado);
        this.filtroAMostrar = (aux.length) ? aux[0].valor : '';

        if ((this.seleccionado === '' || this.seleccionado == null ) && (aux.length > 0)) {            
            this._router.navigate(['novedades/equipos/' + aux[0].cod]);
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
