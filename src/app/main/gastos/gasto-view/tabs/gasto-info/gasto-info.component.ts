import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GastosService } from 'app/main/gastos/gastos.service';
import { Gasto } from 'app/main/gastos/gasto.model';

@Component({
  selector: 'gasto-info',
  templateUrl: './gasto-info.component.html',
  styleUrls: ['./gasto-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class GastoInfoComponent implements OnInit, OnDestroy
{
    info: any;
    @Input() gasto : Gasto;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     */
    constructor(
        private _gastosService: GastosService
    )
    {
      //  console.log("gasto:" + this.gasto.id)
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
        this._gastosService.infoOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(info => {
                this.info = info;
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

