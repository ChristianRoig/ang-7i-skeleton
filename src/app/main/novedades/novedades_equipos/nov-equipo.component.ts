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

    componente = 'nov-equipos';

    titulo = 'Novedades de Equipos';    

    dataSource: FilesDataSource | null;
    
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
        private _router: Router
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
                this.seleccionado = 'Cajas';
                this._router.navigate(['novedades/equipos/' + this.seleccionado]);
            }

        });    
        
        // Combo de Origenes
        this.listOrigenes = this._novedadService.ComboDepSuc;
        this._novedadService.onComboDepSucChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.listOrigenes = data;
            });
     
        this._novedadService.onFilterChanged.next(this.seleccionado);

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

    buscarXFiltro(dato): void {
        this._router.navigate(['novedades/equipos/' + dato.value]);
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
