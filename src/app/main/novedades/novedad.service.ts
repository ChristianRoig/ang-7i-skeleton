import { FuseUtils } from '@fuse/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { ErrorService } from 'app/main/errors/error.service';
import { LoginService } from 'app/main/authentication/login-2/login-2.service';
import { Novedad } from './novedad.model';
import { CombosService } from '../common/combos/combos.service';
import { takeUntil } from 'rxjs/operators';

const API_URL: string = environment.API;

@Injectable()
export class NovedadService implements Resolve<any>
{

    filterBy = '';
    filterPeriodo = '';


    private searchText = '';
    private novedades: Novedad[] = [];
    private invocador = '';

    private _unsubscribeAll: Subject<any>;

    ComboDepSuc = [];
    ComboExtRRHH = [];
    ComboPeriodo = [];
    
    onNovedadesChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onfilterPeriodoChanged: Subject<any>;

    OnInvocadorChanged: Subject<any>;

    onComboDepSucChanged: Subject<any>;
    onComboExtRRHHChanged: Subject<any>;
    onComboPeriodoChanged: Subject<any>;
    
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
        private _combosService: CombosService
    ) {
        // Set the defaults
        this.onNovedadesChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.OnInvocadorChanged = new Subject();

        this.onfilterPeriodoChanged = new Subject();
        
        this.onComboDepSucChanged = new Subject();
        this.onComboExtRRHHChanged = new Subject();
        this.onComboPeriodoChanged = new Subject();

        this._unsubscribeAll = new Subject();
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
                this._getCombos(),                
                this._defineFilters(route),
                this.getNovedades()
            ]).then(
                ([files]) => {

                    /**
                     * Filtros de busqueda
                     */

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

                    // Combos Service
                    this._combosService.onComboOrigenDep_SucChanged.pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(data => {
                            this.ComboDepSuc = data;
                            this.onComboDepSucChanged.next(this.ComboDepSuc);
                        });
                    
                    this._combosService.onComboOrigenExt_RRHHChanged.pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(data => {
                            this.ComboExtRRHH = data;
                            this.onComboExtRRHHChanged.next(this.ComboExtRRHH);
                        });

                    this._combosService.onComboOrigenPeriodoChanged.pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(data => {
                            this.ComboPeriodo = data;
                            this.onComboPeriodoChanged.next(this.ComboPeriodo);
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
     * _getCombos
     * Realiza el llamado al servicio de combos para inicializar los combos necesarios
     */
    private _getCombos(): void {
        this.ComboDepSuc = this._combosService.getCombo('dep-suc');        
        this.onComboDepSucChanged.next(this.ComboDepSuc);

        this.ComboExtRRHH = this._combosService.getCombo('ext-rrhh');
        this.onComboExtRRHHChanged.next(this.ComboExtRRHH);

        this.ComboPeriodo = this._combosService.getCombo('periodos');
        this.onComboPeriodoChanged.next(this.ComboPeriodo);
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
        if (this.filterBy === ':filtro'){
            this.filterBy = '';
        }

        if (this.filterPeriodo === ''){
            const today = new Date();
            this.filterPeriodo = ('00' + (today.getMonth() + 1)).slice(-2) + '-' + today.getFullYear();
            this.onfilterPeriodoChanged.next(this.filterPeriodo);
        }
        
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

        if (!(this.invocador)) {
            return;
        }
        if (!(this.filterBy)) {
            return;
        }

        if (!(this.filterPeriodo)) {
            return;
        }

        console.log('invocador: ' + this.invocador);
        console.log('filterBy: ' + this.filterBy);
        console.log('filterPeriodo: ' + this.filterPeriodo);

        if (this.invocador === 'control') {
            if (this.filterBy === 'GrupoFava'){
                url = url + 'novedades';
                console.log(url);
            }else{
                url = url + 'novedades?empresa=' + this.filterBy + '&periodo=' + this.filterPeriodo;
                console.log(url);
            }

        }else{
            url = url + 'novedades?departamento=' + this.filterBy + '&periodo=' + this.filterPeriodo;
            console.log(url);
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
