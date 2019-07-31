import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector     : 'nomina',
    templateUrl  : './nomina.component.html',
    styleUrls    : ['../colaboradores.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class NominaComponent implements OnInit, OnDestroy 
{    
    columnas = ['avatar', 'docket', 'name', 'departament', 'buttons'];

    hasCheckNomina = false;

    componente = 'nomina';

    titulo = 'Nomina';

    param: any;

    searchInput: FormControl;


    // Protected
    protected _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param { ColaboradoresService } _colaboradoresService
     * @param { FuseSidebarService } _fuseSidebarService
     * @param { MatDialog } _matDialog
     */
    constructor(
        protected _colaboradoresService: ColaboradoresService,
        protected _fuseSidebarService: FuseSidebarService,
        protected _matDialog: MatDialog,
        private _activeRouter: ActivatedRoute,
        private _router: Router
    )
    {


        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();

    }


    ngOnInit(): void {
        this._activeRouter.params.subscribe(params => {

            this.param = params.id;

            if (this.param === '' || this.param == null || this.param === ' ') {
                this._router.navigate(['nomina/' + 'all']);
            }

        });    

        this._colaboradoresService.onFilterChanged.next('all');

        // this._colaboradoresService.onSelectedContactsChanged
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
        //         this._colaboradoresService.onSearchTextChanged.next(searchText);
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
        let posSuc, posDep, posSec;

        posSuc = this.columnas.indexOf('sucursal');
        posDep = this.columnas.indexOf('departament');
        posSec = this.columnas.indexOf('sector');

        switch (value) {
            case 'DTO':
                this.columnas = ['avatar', 'docket', 'name', 'departament', 'buttons'];
                break;
                
            case 'SUC':
                this.columnas = ['avatar', 'docket', 'name', 'sucursal', 'buttons'];
                break;

            case 'NOV':
                this.columnas = ['avatar', 'docket', 'name', 'sector', 'buttons'];
                break;
        
            default:
                this.columnas = ['avatar', 'docket', 'name', 'departament', 'buttons'];
                break;
        }

    }

    

}