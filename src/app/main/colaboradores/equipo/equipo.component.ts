import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';

import { OrigenesService } from '../origenes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector     : 'equipo',
    templateUrl  : './equipo.component.html',
    styleUrls    : ['../colaboradores.component.scss'],
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

    // Protected
    protected _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ColaboradoresService} _colaboradoresService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     * @param {OrigenesService} _origenesService
     */
    constructor(
        protected _colaboradoresService: ColaboradoresService,
        protected _fuseSidebarService: FuseSidebarService,
        protected _matDialog: MatDialog,
        protected _origenesService: OrigenesService,
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

        // Filtro para determinar la API que se consume
        this._colaboradoresService.onFilterChanged.next('all');

        // Filtro x search
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._colaboradoresService.onSearchTextChanged.next(searchText);
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
