import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ComprobantesService } from 'app/main/comprobantes/comprobantes.service';
import { Gasto } from 'app/main/comprobantes/gasto.model';

@Component({
  selector: 'tab-impuestos',
  templateUrl: './tab-impuestos.component.html',
  styleUrls: ['./tab-impuestos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TabImpuestosComponent implements OnInit, OnDestroy
{
    info: any;
    @Input() gasto: Gasto;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     */
    constructor(
        private _comprobantesService: ComprobantesService
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
        // this._comprobantesService.infoOnChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(info => {
        //         this.info = info;
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

