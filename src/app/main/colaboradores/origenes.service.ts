import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Origen } from '../configurar/origenes/origen.model';
import { ErrorService } from '../errors/error.service';


@Injectable()
export class OrigenesService implements Resolve<any>
{
    onOrigenesChanged: BehaviorSubject<any>;
    origenes = [];   

    onOrigenesTablaChanged: BehaviorSubject<any>;
    origenesTabla = [];   

    api = 'api/origenes';
    api2 = "api/tabla";

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param { ErrorService } _errorService
     */
    constructor(
        private _httpClient: HttpClient,
        private _errorService: ErrorService
    )
    {
        // Set the defaults
        this.onOrigenesChanged = new BehaviorSubject([]);
        this.onOrigenesTablaChanged = new BehaviorSubject([]);
              
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
         return new Promise((resolve, reject) => {

            Promise.all([
                this.getOrigenes(),
                this.getOrigenesTabla()
            ]).then(
                ([files]) => {

                    /**
                     * Filtros de busqueda
                     */
                    
                    //  this.onSearchTextChanged.subscribe(searchText => {
                    //     this.searchText = searchText;
                    //     this.getContacts();
                    // });

                    // this.onFilterChanged.subscribe(filter => {
                    //     this.filterBy = filter;
                    //     this.getContacts();
                    // });

                    resolve();

                },
                (error) => {
                    this.origenes = [];
                    this.origenesTabla = [];
                    this.onOrigenesChanged.next(this.origenes);
                    this.onOrigenesTablaChanged.next(this.origenesTabla);

                    this._errorService.errorHandler(error);
                    
                    resolve(this.origenes);
                    resolve(this.origenesTabla);

                }
            );
        }); 
    }

    getOrigenes(): Promise<any>
    {        
        return new Promise((resolve, reject) => {
                this._httpClient.get(this.api)
                    .subscribe((response: []) => {

                        this.origenes = response;

                        this.onOrigenesChanged.next(this.origenes); 
                        resolve(this.origenes);
                    }, reject);
            }
        ); 
        return null;
    }

    getOrigenesTabla(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.api2)
                .subscribe((response: []) => {

                    this.origenesTabla = response;

                    this.origenesTabla = this.origenesTabla.map(d => {
                        return new Origen(d);
                    });  
               

                    this.onOrigenesTablaChanged.next(this.origenesTabla);
                    resolve(this.origenesTabla);
                }, reject);
        }
        );
        return null;
    }

}
