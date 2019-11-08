import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject, Observable } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ActivatedRoute, Router } from '@angular/router';
import { NominaService } from './nomina.service';
import { DataSource } from '@angular/cdk/table';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { fromEvent } from 'rxjs';

@Component({
    selector     : 'nomina',
    templateUrl  : './nomina.component.html',
    styleUrls: ['../../common/colaboradores.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class NominaComponent implements OnInit, OnDestroy 
{    

    columnasDesktop = ['avatar', 'docket', 'name', 'departament'];
    columnasMobile = ['avatar', 'docket', 'name'];

    columnas = this.columnasDesktop;

    hasCheckNomina = false;

    componente = 'nomina';
    titulo = 'Nomina del GrupoFava';

    param: any;

    searchInput: FormControl;

    dataSource: FilesDataSource | null;
    
    placeholder = 'Buscar por legajo, nombre o departamento';

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
        private _nominaService: NominaService
    )
    {


        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();

    }


    ngOnInit(): void {
        
        this._defineColumns(window.innerWidth);

        fromEvent(window, 'resize')
            .subscribe((e: any) => {
                // console.log(e.target.innerWidth);
                this._defineColumns(e.target.innerWidth);
            });

        this.dataSource = new FilesDataSource(this._nominaService);

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._nominaService.onSearchTextChanged.next(searchText);
            });
    }
   

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    updateCheck(c: boolean): void {
        this.hasCheckNomina = c;        

        const col = 'status';

        const pos = this.columnas.indexOf(col);
        if ( pos >= 0){
            this.columnas.splice(pos, 1);
        }else{
            const anteultimo = this.columnas.length - 1; 
            this.columnas.splice(anteultimo, 0, col);
        }
    }

    changeColumns(value: string): void {                
        switch (value) {
            case 'departamentos':
                this.columnas = ['avatar', 'docket', 'name', 'departament', 'buttons'];
                break;
                
            case 'sucursales':
                this.columnas = ['avatar', 'docket', 'name', 'sucursal', 'buttons'];
                break;

            case 'externos':
                this.columnas = ['avatar', 'docket', 'name', 'sector', 'buttons'];
                break;
        
            default:
                this.columnas = ['avatar', 'docket', 'name', 'departament', 'buttons'];
                break;
        }

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


export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {NominaService} _nominaService
     */
    constructor(
        private _nominaService: NominaService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._nominaService.onColaboradoresChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
