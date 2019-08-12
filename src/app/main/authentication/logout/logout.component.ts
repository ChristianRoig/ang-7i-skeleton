import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { LoginService } from '../login-2/login-2.service';
import { Perfil } from 'app/main/perfil/perfil.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector     : 'logout',
    templateUrl  : './logout.component.html',
    styleUrls    : ['./logout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LogoutComponent implements OnInit
{
    perfil: Perfil;

    // Private
    private _unsubscribeAll: Subject<any>;
    
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _loginService: LoginService
        
    )
    {
        this._unsubscribeAll = new Subject();

        // Configure the layout
        // this._fuseConfigService.config = {
        //     layout: {
        //         navbar   : {
        //             hidden: false
        //         },
        //         toolbar  : {
        //             hidden: true
        //         },
        //         footer   : {
        //             hidden: true
        //         },
        //         sidepanel: {
        //             hidden: true
        //         }
        //     }
        // };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._loginService.perfilLogOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(data => {           
                    this.perfil = data;                    
                });

    }

    logout(): void{
        this._loginService.logout();
    }
}
