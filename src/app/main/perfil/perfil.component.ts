import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import { PerfilService } from './perfil.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PerfilComponent implements OnInit, OnDestroy {
  
  info: any;  

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _profileService: PerfilService,    
    private _activeRouter: ActivatedRoute
  ) {
    this._fuseTranslationLoaderService.loadTranslations(spanish, english);

    this._activeRouter.params.subscribe(params => {
      console.log(params);
    });



    this._unsubscribeAll = new Subject();
   }

  ngOnInit(): void {    
    this._profileService.infoOnChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(info => {
        this.info = info;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
