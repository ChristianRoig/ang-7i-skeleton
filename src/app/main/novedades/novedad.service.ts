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
    filterPeriodo = '';


    private searchText = '';
    private novedades: Novedad[] = [];
    private invocador = '';

    onNovedadesChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    OnInvocadorChanged: Subject<any>;
    onfilterPeriodoChanged: Subject<any>;

    
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
        private _loginService: LoginService,
    ) {
        // Set the defaults
        this.onNovedadesChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.OnInvocadorChanged = new Subject();           
        this.onfilterPeriodoChanged = new Subject();
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
        return new Promise((resolve, reject) => {
            Promise.all([                             
                this._defineFilters(route),
                this.getNovedades()
            ]).then(
                ([files]) => {

                    // Filtro por texto                     
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this._filterNovedades();
                    });           

                    // Filtro por periodo, este impacta directamente en el llamado a la base de datos
                    this.onfilterPeriodoChanged.subscribe(periodo => {
                        if (periodo !== undefined && periodo !== this.filterPeriodo){
                            this.filterPeriodo = periodo;
                            this.getNovedades();
                        }                        
                    });
                    
                    resolve();

                },
                (error) => {
                    this.novedades = [];
                    this.onNovedadesChanged.next(this.novedades);

                    // llamado al error service
                    this._errorService.errorHandler(error);

                    resolve(this.novedades);
                    
                }
            );
        });
    }

    /**
     * getNovedades()
     * Conecta con el Backend para traer un conjunto de novedades segun los filtros
     * @returns {Promise<any>}
     */
    getNovedades(): Promise<any> {
        let url = API_URL;

        if (!(this.invocador)) {
            return;
        }
        if (!(this.filterBy)) {
            return;
        }

        if (!(this.filterPeriodo)) {
            return;
        }

        if (this.invocador === 'control') {
            if (this.filterBy === 'GrupoFava'){
                url = url + 'novedades';
                // console.log(url);
            }else{
                url = url + 'novedades?empresa=' + this.filterBy + '&periodo=' + this.filterPeriodo;
                // console.log(url);
            }

        }else{
            url = url + 'novedades?departamento=' + this.filterBy + '&periodo=' + this.filterPeriodo;
            // console.log(url);
        }
        
        return new Promise((resolve, reject) => {
            this._createRequest(url)
                .subscribe((response: Novedad[]) => {
                    if (response == null){
                        response = [];
                    }

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
     * borrarNovedad()
     * Elimina una novedad segun el id
     * @param {string} id 
     */
    borrarNovedad(id: string): void{
        const httpHeaders = new HttpHeaders({
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };
        
        const url = API_URL + 'novedad?id=' + id;

        this._httpClient.delete(url, options).subscribe(
            (res) => { this.getNovedades(); },
            (err) => { console.log(err); }
        );
    }


    /**
     * borrarAllNovedades()
     * Encargado de eliminar todas las novedades segun un periodo y departamento/origen
     * @param {string} periodo
     * @param {string} departamento
     */
    borrarAllNovedades(periodo: string, departamento: string): void {        
        const httpHeaders = new HttpHeaders({
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };
        
        const url = API_URL + 'novedades?departamento=' + departamento + '&periodo=' + periodo;

        this._httpClient.delete(url, options).subscribe(
            (res) => { this.getNovedades(); },
            (err) => {
                this._errorService.errorHandler(err);
            }
        );

    }

    /**
     * updateNovedad()
     * Se encarga de enviar al backend una novedad para que sea actualizada
     * @param {Novedad} nov 
     */
    updateNovedad(nov: Novedad): void {
        console.log('Updatear Novedad');
        console.log(nov);

        nov.periodo = this._tratamientoDate(nov.periodo);

        console.log(this.invocador);

        const httpHeaders = new HttpHeaders({
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };

        const url = API_URL + 'novedad?id=' + nov.idNovedad;
        // const url = 'http://10.100.58.83:8083/ges-rrhh-svc/' + 'novedad?id=' + nov.idNovedad;    

        this._httpClient.put(url, nov, options).subscribe(
            (res) => {
                console.log('respuesta ' + res);

                if (this.invocador !== 'equipo') {
                    this.getNovedades();
                }

            },
            (err) => {
                this._errorService.errorHandler(err);
            }
        );
    }


    /**
     * addNovedad()
     * Se encarga de enviar al backend una novedad para que sea guardada
     * @param {Novedad} nov 
     */
    addNovedad(nov: Novedad): void {
        console.log('Agregar Novedad');
        console.log(nov);

        nov.periodo = this._tratamientoDate(nov.periodo);

        console.log(this.invocador);

        const httpHeaders = new HttpHeaders({
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };

        const url = API_URL + 'novedad';        

        this._httpClient.post(url, nov , options).subscribe(
            (res) => { 
                console.log('respuesta ' + res);

                if (this.invocador !== 'equipo') {
                    this.getNovedades();
                }
                
             },
            (err) => {
                this._errorService.errorHandler(err);
            }
        );
        
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * _tratamientoDate()
     * Manejo del string date para que se corresponda con lo esperado por el backend
     * @param {string} date 
     */
    private _tratamientoDate(date: string): string {
        if (date.length !== 7){
            return date;
        }
        return date.split('-')[1] + '-' + date.split('-')[0] + '-01 00:00:00';
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
     * _defineFilters()
     * Define el filtro segun la url del componente que invoco al servicio
     * @param {ActivatedRouteSnapshot} _r
     */
    private _defineFilters(_r: ActivatedRouteSnapshot): void {

        this.invocador = _r.routeConfig.path.split('/')[1];
        this.filterBy = (_r.params.filtro) ? _r.params.filtro : _r.routeConfig.path.split('/')[2];
        if (this.filterBy === ':filtro') {
            this.filterBy = '';
        }

        if (this.filterPeriodo === '') {
            const today = new Date();
            this.filterPeriodo = ('00' + (today.getMonth() + 1)).slice(-2) + '-' + today.getFullYear();            
        }

        this.OnInvocadorChanged.next(this.invocador);
        this.onFilterChanged.next(this.filterBy);
    }

    /**
     * Crea el llamado a los servicios de back
     * @param {string} url     
     */
    private _createRequest(url: string): Observable<any> | any {
        const httpHeaders = new HttpHeaders({
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };

        return this._httpClient.get(url, options);
    }

}
