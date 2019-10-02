import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { PerfilService } from '../../perfil.service';
import { takeUntil } from 'rxjs/operators';
import { Contact } from 'app/main/personas/contact.model';

@Component({
  selector: 'perfil-imagenes',
  templateUrl: './perfil-imagenes.component.html',
  styleUrls: ['./perfil-imagenes.component.scss']
})
export class PerfilImagenesComponent implements OnInit, OnDestroy {

  info: any;

// Private
    private _unsubscribeAll: Subject<any>;

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
        this._unsubscribeAll = new Subject();
        this.info = new Contact({});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._profileService.infoOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
              this.info = data;
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
