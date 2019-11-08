import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ConceptosService } from 'app/main/configurar/conceptos.service';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { fromEvent } from 'rxjs';

@Component({
    selector     : 'conceptos',
    templateUrl  : './conceptos.component.html',
    styleUrls    : ['../../common/colaboradores.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class ConceptosComponent implements OnInit, OnDestroy
{
    dialogRef: any;

    searchInput: FormControl;

    columnasDesktop = ['cod', 'descripcion', 'tipo', 'cod_origen', 'buttons'];
    columnasMobile = ['cod', 'descripcion', 'buttons'];

    columnas = this.columnasDesktop;

    placeholder = 'Buscar por codigo, nombre, origen o tipo';

    componente = 'conceptos';

    titulo = 'Conceptos';

    protected _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     * @param {ConceptosService} _conceptosService
     */
    constructor(
        protected _fuseSidebarService: FuseSidebarService,
        protected _matDialog: MatDialog,
        protected _conceptosService: ConceptosService
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
        this._defineColumns(window.innerWidth);

        fromEvent(window, 'resize')
            .subscribe((e: any) => {
                // console.log(e.target.innerWidth);
                this._defineColumns(e.target.innerWidth);
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._conceptosService.onSearchTextChanged.next(searchText);
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
    * Encargado de definir que columnas se van a mostrar dependiendo de la resolucion de la pantalla
    * @param width
    */
    private _defineColumns(width: number): void {
        if (width <= 599) {
            this.columnas = this.columnasMobile;
        } else {
            this.columnas = this.columnasDesktop;
        }
    }

}
