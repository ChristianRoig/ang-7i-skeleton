import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { LoginService } from './login-2.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorService } from '../../errors/error.service';
import { Router } from '@angular/router';


@Component({
    selector     : 'login-2',
    templateUrl  : './login-2.component.html',
    styleUrls    : ['./login-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class Login2Component implements OnInit, OnDestroy
{
    loginForm: FormGroup;

    info: any;

    errorLog = false;
    error = false;


    // Private
    protected _unsubscribeAll: Subject<any>;
    
    /**
     * Constructor
     * 
     * @param {FuseConfigService} _fuseConfigService 
     * @param {FormBuilder} _formBuilder 
     * @param {LoginService} _loginService 
     * @param {ErrorService} _errorService 
     * @param {Router} _router 
     */
    constructor(
        // private router: Router,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _loginService: LoginService,
        private _errorService: ErrorService,
        private _router: Router
    )
    {
        if (!this._errorService.isBrowserCompatible()) {
            this._router.navigate(['/error']); 
        }

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

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
        this.loginForm = this._formBuilder.group({
            email: ['macchiavello.florencia', [Validators.required]], // , Validators.email
            password: ['P@ssword', Validators.required]
        });

        this._loginService.infoOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(info => {                
                if (info){
                    this.info = info;                    

                    if (info === 'error'){
                        console.log('error sistema');
                        this.error = true; // Error Sistema
                    }
                                                     
                } else { // null
                    console.log('error log');                                        
                    this.errorLog = true;
                }
        
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

    onSubmit(): void{        
        this._loginService.login(this.loginForm.get('email').value, this.loginForm.get('password').value);
    }

}
