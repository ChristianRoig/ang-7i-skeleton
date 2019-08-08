import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Origen } from './origenes/origen.model';
import { ErrorService } from '../errors/error.service';


@Injectable()
export class OrigenesService implements Resolve<any>
{
    onOrigenesChanged: BehaviorSubject<any>;
    origenes = [];   

    private searchText = '';
    onSearchTextChanged: Subject<any>;

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

        this.onSearchTextChanged = new Subject();
              
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
                this.getOrigenes()
            ]).then(
                ([files]) => {

                    /**
                     * Filtros de busqueda
                     */
                    
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this._filterOrigenes();
                    });

                    // this.onFilterChanged.subscribe(filter => {
                    //     this.filterBy = filter;
                    //     this.getContacts();
                    // });

                    resolve();

                },
                (error) => {
                    this.origenes = [];                    
                    this.onOrigenesChanged.next(this.origenes);       
                    this._errorService.errorHandler(error);
                    
                    resolve(this.origenes);       
                }
            );
        }); 
    }
    
    /**
     * _filterOrigenes()
     * Dependiendo del texto ingresado filtra el contenido del objeto origenes
     */
    private _filterOrigenes(): void {
        let aux = this.origenes;
        if (this.searchText && this.searchText !== '') {
            aux = FuseUtils.filterArrayByString(this.origenes, this.searchText);
        }

        this.onOrigenesChanged.next(aux);
    }

    getOrigenes(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/tabla')
                .subscribe((response: []) => {

                    this.origenes = response;

                    this.origenes = this.origenes.map(d => {
                        return new Origen(d);
                    });  
               

                    this.onOrigenesChanged.next(this.origenes);
                    resolve(this.origenes);
                }, reject);
        });
    }

}
