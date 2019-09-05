import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Concepto } from './conceptos/concepto.model';
import { ErrorService } from '../errors/error.service';
import { FuseUtils } from '@fuse/utils';


@Injectable()
export class ConceptosService implements Resolve<any>
{    
    
    TablaConceptos = [];   

    api2 = 'api/tablaConceptos';
    
    private searchText = '';
    onSearchTextChanged: Subject<any>;
    onConceptosTablaChanged: BehaviorSubject<any>;
    
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
                this.getConceptosTabla(),
            ]).then(
                ([files]) => {

                    /**
                     * Filtros de busqueda
                     */
                    
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this._filterConceptos();
                    });                

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

  

    /**
     * getConceptosTabla()
     * Encargado de traer del backend los conceptos
     */
    getConceptosTabla(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/tablaConceptos')
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


    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * _filterConceptos()
     * Dependiendo del texto ingresado filtra el contenido del objeto origenes
     */
    private _filterConceptos(): void {
        let aux = this.TablaConceptos;
        if (this.searchText && this.searchText !== '') {
            aux = FuseUtils.filterArrayByString(this.TablaConceptos, this.searchText);
        }

        this.onConceptosTablaChanged.next(aux);
    }
}
