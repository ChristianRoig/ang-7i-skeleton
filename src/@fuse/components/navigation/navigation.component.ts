import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { LoginService } from '../../../app/main/authentication/login-2/login-2.service';

@Component({
    selector       : 'fuse-navigation',
    templateUrl    : './navigation.component.html',
    styleUrls      : ['./navigation.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit
{
    @Input()
    layout = 'vertical';

    @Input()
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _loginService: LoginService
    )
    {
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
        // Load the navigation either from the input or from the service
        this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();

        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Load the navigation
                this.navigation = this._fuseNavigationService.getCurrentNavigation();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._visualizarSegunRol();
        
        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
         .subscribe(() => {

             // Mark for check
             this._changeDetectorRef.markForCheck();
         });
    }


    private _visualizarSegunRol(): void {
        let rol = this._loginService.getRol();
        
        if (!(rol)) {
            return;
        }

        switch (rol) {
            case 'RRHH':
                this._fuseNavigationService.updateNavigationItem('equipo', {
                    hidden: false
                });
                this._fuseNavigationService.updateNavigationItem('nov-equipo', {
                    hidden: false
                });
                this._fuseNavigationService.updateNavigationItem('nov-sector', {
                    hidden: false
                });
                this._fuseNavigationService.updateNavigationItem('control_de_novedades', {
                    hidden: false
                });
                this._fuseNavigationService.updateNavigationItem('origenes', {
                    hidden: false
                });
                this._fuseNavigationService.updateNavigationItem('conceptos', {
                    hidden: false
                });

                break;
            case 'ResSector':
                this._fuseNavigationService.updateNavigationItem('equipo', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('nov-equipo', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('nov-sector', {
                    hidden: false
                });
                this._fuseNavigationService.updateNavigationItem('control_de_novedades', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('origenes', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('conceptos', {
                    hidden: true
                });
                break;
            case 'ResEquipo':
                this._fuseNavigationService.updateNavigationItem('nov-equipo', {
                    hidden: false
                });
                this._fuseNavigationService.updateNavigationItem('equipo', {
                    hidden: false
                });
                this._fuseNavigationService.updateNavigationItem('nov-sector', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('control_de_novedades', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('origenes', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('conceptos', {
                    hidden: true
                });

                break;
            case 'comun':
                this._fuseNavigationService.updateNavigationItem('equipo', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('nov-equipo', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('nov-sector', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('control_de_novedades', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('origenes', {
                    hidden: true
                });
                this._fuseNavigationService.updateNavigationItem('conceptos', {
                    hidden: true
                });

                break;

            default:
                break;
        }


    }
}
