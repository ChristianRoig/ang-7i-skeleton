import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Concepto } from './conceptos/concepto.model';
import { ErrorService } from '../errors/error.service';


@Injectable()
export class ConceptosService implements Resolve<any>
{    
    onConceptosTablaChanged: BehaviorSubject<any>;
    
    TablaConceptos = [];   

    // api = 'api/conceptos';
    api2 = 'api/tablaConceptos';

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {ErrorService} _errorService
     */
    constructor(
        private _httpClient: HttpClient,
        private _errorService: ErrorService
    )
    {
        // Set the defaults        
        this.onConceptosTablaChanged = new BehaviorSubject([]);
              
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
                this.getConceptosTabla(),
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
                    this.TablaConceptos = [];

                    this.onConceptosTablaChanged.next(this.TablaConceptos);                    

                    this._errorService.errorHandler(error);
                    
                    resolve(this.TablaConceptos);                    
                }
            );
        }); 
    }

    getOrigenes(tipo: string): string[] {
        let data = null;

        if (!(tipo !== 'rrhh' && tipo !== 'externo')){
            this._httpClient.get('api/' + tipo).subscribe(d => {
                data = d;
            },
                (error) => { 
                    this._errorService.errorHandler(error);
                }
            );    
        }

        return data;
    }

    getConceptosTabla(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.api2)
                .subscribe((response: []) => {

                    this.TablaConceptos = response;

                    this.TablaConceptos = this.TablaConceptos.map(c => {
                        return new Concepto(c);
                    });  

                    this.onConceptosTablaChanged.next(this.TablaConceptos);
                    resolve(this.TablaConceptos);
                }, reject);
            }
        );
    }
}
