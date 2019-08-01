import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { OrigenesService } from '../../configurar/origenes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipoService } from './equipo.service';
import { DataSource } from '@angular/cdk/table';



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

    listOrigenes = [];

    seleccionado = 'Tesoreria Cajas';

    componente = 'equipo';

    titulo = 'Equipo de Colaboradores';

    param: any;

    dataSource: FilesDataSource | null;    

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EquipoService} _equipoService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {OrigenesService} _origenesService
     */
    constructor(
        private _equipoService: EquipoService,
        private _fuseSidebarService: FuseSidebarService,        
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

            this.param = params.id;

            if (this.param === '' || this.param == null || this.param === ' ') {
                this._router.navigate(['equipo/' + 'cajas']);
            }

        });

        // Combo de Origenes
        this._origenesService.onOrigenesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.listOrigenes = data;
            });

        this.dataSource = new FilesDataSource(this._equipoService);

        // this._equipoService.onColaboradoresChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(data => {
        //         this.colaboradores = data;
        //     });

        // Filtro para determinar la API que se consume

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
