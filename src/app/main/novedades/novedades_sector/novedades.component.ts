import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';

import { Router, ActivatedRoute } from '@angular/router';
import { ConceptosService } from 'app/main/configurar/conceptos.service';
import { NovedadService } from '../novedad.service';
import { DataSource } from '@angular/cdk/table';

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

    componente = 'sector';
    sectores = '';

    seleccionado = 'Premios Ventas';

    titulo = 'Novedades por Sector';

    param: any;

    dataSource: FilesDataSource | null;
    
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

            this.param = params.id;

            if (this.param === '' || this.param == null || this.param === ' ') {
                this._router.navigate(['novedades/sectores/' + 'cajas']);
            }

        });    
        
        this._conceptosService.onConceptosChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {                
                this.sectores = data;
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
