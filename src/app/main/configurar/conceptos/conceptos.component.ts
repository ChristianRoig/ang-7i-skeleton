import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ConceptosService } from 'app/main/colaboradores/conceptos.service';




@Component({
    selector     : 'conceptos',
    templateUrl  : './conceptos.component.html',
    styleUrls    : ['../../colaboradores/colaboradores.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class ConceptosComponent implements OnInit, OnDestroy
{
    dialogRef: any;

    searchInput: FormControl;

    columnas = ['cod', 'nombre', 'tipo', 'origenNombre', 'buttons'];

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
        // this._conceptosService.onConceptosTablaChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(data => {           
        //         this.listConceptos = data;
        //         console.log(data);
        //     });



        // this.searchInput.valueChanges
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         debounceTime(300),
        //         distinctUntilChanged()
        //     )
        //     .subscribe(searchText => {
        //         this._colaboradoresService.onSearchTextChanged.next(searchText);
        //     });
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
