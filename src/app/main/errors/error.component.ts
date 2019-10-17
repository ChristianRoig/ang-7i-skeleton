import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { ErrorService } from './error.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { LoginService } from '../authentication/login-2/login-2.service';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
    selector     : 'error',
    templateUrl  : './error.component.html',
    styleUrls    : ['./error.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ErrorComponent implements OnInit, OnDestroy
{
    errorCode: any;
    message: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    
    /**
     * Constructor
     */
    constructor(private _errorService: ErrorService, private _loginService: LoginService,
                private _fuseConfigService: FuseConfigService){
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        if (!(this._loginService.isSetLog())){
            // Configure the layout
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: true
                    },
                    toolbar: {
                        hidden: true
                    },
                    footer: {
                        hidden: true
                    },
                    sidepanel: {
                        hidden: true
                    }
                }
            };
        }


        this._errorService.updateErrorCodeSubject
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.errorCode = data;
            });

        this._errorService.updateMessageSubject
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
                this.message = data;
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
