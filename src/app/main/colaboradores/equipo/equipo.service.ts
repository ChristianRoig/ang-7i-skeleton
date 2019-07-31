import { FuseUtils } from '@fuse/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { Perfil } from 'app/main/perfil/perfil.model';
import { ErrorService } from 'app/main/errors/error.service';
import { LoginService } from 'app/main/authentication/login-2/login-2.service';

const API_URL: string = environment.API;

@Injectable()
export class EquipoService implements Resolve<any>
{   
    
    filterBy = ''; 
    
    private searchText = '';
    private colaboradores: Perfil[] = [];    

    onColaboradoresChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {ErrorService} _errorService
     * @param {LoginService} _loginService
     */
    constructor(
        private _httpClient: HttpClient,
        private _errorService: ErrorService,
        private _loginService: LoginService
    )
    {
        // Set the defaults
        this.onColaboradoresChanged = new BehaviorSubject([]);        
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();         
               
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
                this.getColaboradores()
            ]).then(
                ([files]) => {

                    /**
                     * Filtros de busqueda
                     */
                    
                    // Filtro por parametro 
                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getColaboradores();
                    });

                    // Filtro por texto                     
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this._filterColaboradores();
                    });    

                    resolve();

                },
                (error) => {
                        this.colaboradores = [];
                        this.onColaboradoresChanged.next(this.colaboradores);
                        
                        this._errorService.errorHandler(error);

                        resolve(this.colaboradores);
                    }
            );
        }); 
    }

    /**
     * _filterColaboradores()
     * Dependiendo del texto ingresado filtra el contenido del objeto colaboradores
     */
    private _filterColaboradores(): void{        
        let aux = this.colaboradores;
        if (this.searchText && this.searchText !== '') {
            aux = FuseUtils.filterArrayByString(this.colaboradores, this.searchText);        
        }

        this.onColaboradoresChanged.next(aux);
    }

    /**
     * getColaboradores()
     * Conecta con el Backend para traer un conjunto de colaboradores segun los filtros
     * @returns {Promise<any>}
     */
    getColaboradores(): Promise<any>{
        let url = API_URL;
        let params = {};

        url = API_URL + 'obtenerColaboradoresByDepartamento';
        
        params = {
            'departamento': 'Tesoreria cajas' // cambiar por el filtro que se pase como parametro
        };

        return new Promise((resolve, reject) => {
                this._createRequest(url, params)
                    .subscribe((response: Perfil[]) => {
    
                    this.colaboradores = response;
    
                    this.colaboradores = this.colaboradores.map(contact => {
                        return new Perfil(contact);
                    });
    
                    this.onColaboradoresChanged.next(this.colaboradores); 
    
                    resolve(this.colaboradores);
    
                }, reject);
            }
        ); 

    }


    /**
     * Crea el llamado a los servicios de back
     * @param {string} user 
     */
    private _createRequest(url: string, params: {}): Observable<any> | any {       
        const httpHeaders = new HttpHeaders({            
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };

        return this._httpClient.post(url, params, options);
    }

}
