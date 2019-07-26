import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Concepto } from '../configurar/conceptos/concepto.model';
import { ErrorService } from '../errors/error.service';

@Injectable()
export class ConceptosService implements Resolve<any>
{
    onConceptosChanged: BehaviorSubject<any>;
    onConceptosTablaChanged: BehaviorSubject<any>;

    conceptos = [];   
    TablaConceptos = [];   

    // api = 'api/conceptos';
    api = 'api/sectores';
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
        this.onConceptosChanged = new BehaviorSubject([]);
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
                this.getConceptos(),
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
                    this.conceptos = [];
                    this.TablaConceptos = [];

                    this.onConceptosTablaChanged.next(this.TablaConceptos);
                    this.onConceptosChanged.next(this.conceptos);

                    this._errorService.errorHandler(error);

                    resolve(this.conceptos);
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

    getConceptos(): Promise<any>
    {        
        return new Promise((resolve, reject) => {
                this._httpClient.get(this.api)
                    .subscribe((response: []) => {

                        this.conceptos = response;

                        this.onConceptosChanged.next(this.conceptos); 
                        resolve(this.conceptos);
                    }, reject);
            }
        ); 
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
