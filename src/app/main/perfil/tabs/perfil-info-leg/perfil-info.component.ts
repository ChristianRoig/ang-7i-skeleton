import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { PerfilService } from '../../perfil.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'perfil-info-leg',
  templateUrl: './perfil-info.component.html',
  styleUrls: ['./perfil-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PerfilInfoLegComponent implements OnInit, OnDestroy
{
    @Input() info: any;
    @Input() isHide: boolean;

    // Private
    // private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {PerfilService} _profileService
     */
    constructor(
        private _profileService: PerfilService
    )
    {
        // Set the private defaults
        // this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // this._profileService.infoOnChanged
        //    .pipe(takeUntil(this._unsubscribeAll))
        //    .subscribe(info => {
        //        this.info = info;
        //    });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next();
        // this._unsubscribeAll.complete();
    }
}

