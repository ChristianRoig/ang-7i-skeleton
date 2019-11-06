import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ActivatedRoute, Router } from '@angular/router';
import { EquipoService } from './equipo.service';
import { DataSource } from '@angular/cdk/table';
import { FuseUtils } from '@fuse/utils';
import { CombosService } from '../../common/combos/combos.service';


@Component({
    selector     : 'equipo',
    templateUrl  : './equipo.component.html',
    styleUrls    : ['../../common/colaboradores.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ColaboradoresComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;

    @Input() hasCheck = true;

    columnas = ['avatar', 'name', 'docket', 'departament', 'email', 'novedades', 'buttons'];

    placeholder = 'Buscar por nombre legajo departamento email o novedades';

    listOrigenes = [];

    seleccionado = '';

    filtroAMostrar: any;

    componente = 'equipo';

    titulo = 'Equipo de Colaboradores';

    dataSource: FilesDataSource | null;    

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EquipoService} _equipoService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {ActivatedRoute} _activeRouter
     * @param {Router} _router
     */
    constructor(
        private _equipoService: EquipoService,
        private _fuseSidebarService: FuseSidebarService,                
        private _activeRouter: ActivatedRoute,
        private _router: Router,
        private _combosService: CombosService
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
            this.seleccionado = params.equipo;
        });

        // Combo de Origenes
        this._combosService.onComboOrigenDep_SucChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.listOrigenes = data;
                this._defineAMostrar();
            });
        

        this.dataSource = new FilesDataSource(this._equipoService);   

        // Filtro x search
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._equipoService.onSearchTextChanged.next(searchText);
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
    buscarXFiltro(elemento): void{        
        this.seleccionado = elemento.cod;
        this.filtroAMostrar = elemento.valor; 

        this._router.navigate(['equipo/' + elemento.cod]);
    }

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * _defineAMostrar()
     */
    private _defineAMostrar(): void {
        const aux: any[] = FuseUtils.filterArrayByString(this.listOrigenes, this.seleccionado);
        this.filtroAMostrar = (aux.length) ? aux[0].valor : '';

        if ((this.seleccionado === '' || this.seleccionado == null ) && (aux.length > 0)) {            
            this._router.navigate(['equipo/' + aux[0].cod]);
        }
    }
}


export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {EquipoService} _equipoService
     */
    constructor(
        private _equipoService: EquipoService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._equipoService.onColaboradoresChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
