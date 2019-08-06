import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NominaService } from '../../../colaboradores/nomina/nomina.service';
import { NovedadService } from '../../../novedades/novedad.service';

@Component({
    selector   : 'general-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class ContactsMainSidebarComponent implements OnInit, OnDestroy
{
    user: any;
    filterBy: string;
    isCheck = false;
    url = '';

    @Output() isCheckSideBar: EventEmitter<boolean>;
    @Output() isFilter: EventEmitter<string>;
    @Input() invocador: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *     
     */
    constructor(        
        private _nominaService: NominaService,
        private _novedadService: NovedadService
    )
    {
        this.isCheckSideBar = new EventEmitter<any>();
        this.isFilter = new EventEmitter<any>();

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
        // console.log('sidebars');
        // console.log(this.isCheck);
        
        if (this.invocador === 'nomina') {
            this.filterBy = this._nominaService.filterBy || 'GrupoFava';      
            this.url = 'nomina';
        }

        if (this.invocador === 'ControlNovedades') {
            this.filterBy = this._novedadService.filterBy || 'GrupoFava';      
            this.url = 'novedades/control';
        }
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
     * Change the filter
     *
     * @param filter
     */
    changeFilter(filter): void
    {
        this.filterBy = filter;
        // this._colaboradoresService.onFilterChanged.next(this.filterBy);

        console.log(this.filterBy);
        this.isFilter.emit(this.filterBy); // Lo emito para cambiar las columnas del componente
      
    }

    changeCheck(): void {        
        this.isCheckSideBar.emit(this.isCheck);        
    }
}
