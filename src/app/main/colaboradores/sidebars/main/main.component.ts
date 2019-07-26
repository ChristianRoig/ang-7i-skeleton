import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ColaboradoresService } from 'app/main/colaboradores/colaboradores.service';

@Component({
    selector   : 'contacts-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class ContactsMainSidebarComponent implements OnInit, OnDestroy
{
    user: any;
    filterBy: string;
    isCheck = false;


    @Output() isCheckSideBar: EventEmitter<boolean>;
    @Output() isFilter: EventEmitter<string>;

    @Input() invocador: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ColaboradoresService} _colaboradoresService
     */
    constructor(
        private _colaboradoresService: ColaboradoresService
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
        console.log(this.isCheck);
        this.filterBy = this._colaboradoresService.filterBy || 'all';

        this._colaboradoresService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
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
        this._colaboradoresService.onFilterChanged.next(this.filterBy);

        console.log(this.filterBy);
        this.isFilter.emit(this.filterBy);
      
    }

    changeCheck(): void {
        // console.log('changeCheck() ' + this.isCheck);
        this.isCheckSideBar.emit(this.isCheck);        
    }
}
