import { FuseUtils } from '@fuse/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { ErrorService } from 'app/main/errors/error.service';
import { LoginService } from 'app/main/authentication/login-2/login-2.service';
import { Novedad } from './novedad.model';

const API_URL: string = environment.API;

@Injectable()
export class NovedadService implements Resolve<any>
{

    filterBy = '';

    private searchText = '';
    private novedades: Novedad[] = [];
    private invocador = '';

    onNovedadesChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    OnInvocadorChanged: Subject<any>;

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
    ) {
        // Set the defaults
        this.onNovedadesChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.OnInvocadorChanged = new Subject();
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        this._defineFilter(route);

        return new Promise((resolve, reject) => {

            Promise.all([
                // this._defineFilter(route),
                this.getNovedades()
            ]).then(
                ([files]) => {

                    /**
                     * Filtros de busqueda
                     */

                    // Filtro por texto                     
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        // this._filterNovedades();
                    });



                    resolve();

                },
                (error) => {
                    this.novedades = [];
                    this.onNovedadesChanged.next(this.novedades);

                    // this.filterBy = 'GrupoFava';
                    // this.onFilterChanged.next(this.filterBy);

                    this._errorService.errorHandler(error);

                    resolve(this.novedades);
                    // resolve(this.filterBy);
                }
            );
        });
    }


    /**
     * _filterNovedades()
     * Dependiendo del texto ingresado filtra el contenido del objeto novedades
     */
    private _filterNovedades(): void {
        let aux = this.novedades;
        if (this.searchText && this.searchText !== '') {
            aux = FuseUtils.filterArrayByString(this.novedades, this.searchText);
        }

        this.onNovedadesChanged.next(aux);
    }

    /**
     * _defineFilter()
     * Define el filtro segun la url del componente que invoco al servicio
     * @param {ActivatedRouteSnapshot} _r
     */
    private _defineFilter(_r: ActivatedRouteSnapshot): void {
        this.invocador = _r.routeConfig.path.split('/')[1];
        this.filterBy = _r.params.filtro;

        this.OnInvocadorChanged.next(this.invocador);
        this.onFilterChanged.next(this.filterBy);
    }

    /**
     * getNovedades()
     * Conecta con el Backend para traer un conjunto de novedades segun los filtros
     * @returns {Promise<any>}
     */
    getNovedades(): Promise<any> {
        let url = API_URL;
        let params = {};
        let verbo = 'post';



        if (!(this.invocador)) {
            return;
        }
        if (!(this.filterBy)) {
            return;
        }

        
        if (this.invocador === 'equipos'){ // componente
            // Mock
                const mock = 'api/contactos-novEquipo';
                verbo = 'get';

                url = mock;
            // Fin Mock
        }

        if (this.invocador === 'sectores') { // componente
            // Mock
                const mock = 'api/contactos-novEquipo';
                verbo = 'get';
    
                url = mock;
            // Fin Mock
        }

        return new Promise((resolve, reject) => {
            this._createRequest(url, verbo, params)
                .subscribe((response: Novedad[]) => {
                    this.novedades = response;

                    this.novedades = this.novedades.map(novedad => {
                        return new Novedad(novedad);
                    });

                    this.onNovedadesChanged.next(this.novedades);

                    resolve(this.novedades);

                }, reject);
        });

    }


    /**
     * Crea el llamado a los servicios de back
     * @param {string} url
     * @param {string} verbo ('get' o 'post')
     * @param {{}} params
     */
    private _createRequest(url: string, verbo: string, params?: {}): Observable<any> | any {
        // const httpHeaders = new HttpHeaders({
        //     'Authorization': this._loginService.getLocalToken()
        // });

        // const options = { headers: httpHeaders };

        // if (verbo === 'post') {
        //     return this._httpClient.post(url, params, options);
        // }

        // return this._httpClient.get(url, options);
        return this._httpClient.get(url);
    }

}
