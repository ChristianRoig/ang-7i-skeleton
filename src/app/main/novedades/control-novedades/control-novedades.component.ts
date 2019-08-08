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

@Component({
    selector     : 'control-novedades',
    templateUrl  : './control-novedades.component.html',
    styleUrls: ['../../common/colaboradores.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ControlNovedadesComponent implements OnInit, OnDestroy 
{
    
    columnas = ['avatar', 'docket', 'name', 'departament', 'buttons'];

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
        private _novedadService: NovedadService
     )
    {

        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        
    }

    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this._novedadService);
            
        this.periodos = this._novedadService.harcodeadoPeriodos;
        this.periodoSelect = (this.periodos.length !== 0) ? this.periodos[Math.floor(Math.random() * 12)] : '';
        
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._novedadService.onSearchTextChanged.next(searchText);
            });

        // this._activeRouter.params.subscribe(params => {

        //     this.param = params.id;

        //     if (this.param === '' || this.param == null || this.param === ' ') {
        //         this.param = 'all';
        //         this._router.navigate(['novedades/control/' + this.param]);
        //     }

        // });    

        // this._controlNovedadesService.onFilterChanged.next('all');

        // this._controlNovedadesService.onSelectedContactsChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(selectedContacts => {
        //         this.hasSelectedContacts = selectedContacts.length > 0;
        //     });

        // this.searchInput.valueChanges
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         debounceTime(300),
        //         distinctUntilChanged()
        //     )
        //     .subscribe(searchText => {
        //         this._controlNovedadesService.onSearchTextChanged.next(searchText);
        //     });
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
        // console.log("cambio " + this.hasCheckNomina);

        const col = 'statusNovedades';

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




        // let pos = -1;
        
        // if (b){            
        //     pos = this.columnas.indexOf('departament');

        //     if (pos !== -1){
        //         this.columnas[pos] = 'concepto';
        //     }

        // }else{
        //     pos = this.columnas.indexOf('concepto');

        //     if (pos !== -1) {
        //         this.columnas[pos] = 'departament';
        //     }
        // }
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
