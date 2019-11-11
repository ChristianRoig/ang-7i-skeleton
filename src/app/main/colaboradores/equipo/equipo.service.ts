import { FuseUtils } from '@fuse/utils';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { Perfil } from 'app/main/perfil/perfil.model';
import { ErrorService } from 'app/main/errors/error.service';
import { LoginService } from 'app/main/authentication/login-2/login-2.service';
import { CombosService } from '../../common/combos/combos.service';
import { takeUntil } from 'rxjs/operators';

const API_URL: string = environment.API;

@Injectable()
export class EquipoService implements Resolve<any>
{   
    
    filterBy = ''; 
    private ComboOrigenes = [];    
    private searchText = '';
    private colaboradores: Perfil[] = [];    
    private _unsubscribeAll: Subject<any>;
    
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
        private _loginService: LoginService,
        private _combosService: CombosService,
    )
    {
        // Set the defaults
        this.onColaboradoresChanged = new BehaviorSubject([]);        
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();         
        

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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        
        return new Promise((resolve, reject) => {

            Promise.all([
                this._getComboOrigenes(),
                this._defineFilter(route),
                this.getColaboradores()
            ]).then(
                ([files]) => {

                    /**
                     * Filtro de busqueda por texto
                     */
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this._filterColaboradores();
                    });

                    this._combosService.onComboOrigenDep_SucChanged.pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((data: []) => {                    
                            if (this.ComboOrigenes.length !== data.length){
                                this.ComboOrigenes = data;
                                this._defineFilter(route);
                                this.getColaboradores();
                            }                            
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
     * getColaboradores()
     * Conecta con el Backend para traer un conjunto de colaboradores segun los filtros
     * @returns {Promise<any>}
     */
    getColaboradores(): Promise<any> {
        if (this.ComboOrigenes.length === 0) { return; }

        if (this.filterBy === '' || this.filterBy === ' ') { // Fix para no hacer una consulta sin sentido            
            this.colaboradores = [];
            this.onColaboradoresChanged.next(this.colaboradores);
            return;
        }

        const url = API_URL + 'colaboradores?departamento=' + this.filterBy;

        return new Promise((resolve, reject) => {
            this._createRequest(url)
                .subscribe((response: Perfil[]) => {
                    if (response == null) {
                        response = [];
                    }

                    this.colaboradores = response.map(contact => {
                        return new Perfil(contact);
                    });

                    this.onColaboradoresChanged.next(this.colaboradores);

                    resolve(this.colaboradores);

                }, reject);
            }
        );

    }

    /**
     * Encargado de sumar 1 al registro de cantNovedadesUltimoMes de un colaborador, si es que existe.
     * @param {string} legajo
     */
    updateContador(legajo: string): void {
        if (this.colaboradores.length > 0){
            let i = 0;            
            let cortar: boolean = false;
                    
            while ((i < this.colaboradores.length) && (cortar == false)){
                if (this.colaboradores[i].legajo == legajo){
                    
                    console.log(this.colaboradores[i].cantNovedadesUltimoMes);
                    this.colaboradores[i].cantNovedadesUltimoMes++;
                    console.log(this.colaboradores[i].cantNovedadesUltimoMes);
                    
                    cortar = true;   
                }

                i++;
            }

        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * _defineFilter()
     * Define el filtro segun la url del componente que invoco al servicio
     * @param {ActivatedRouteSnapshot} _r
     */
    private _defineFilter(_r: ActivatedRouteSnapshot): void {
        if (this.ComboOrigenes.length === 0) { return; }
        
        const aux = _r.params.equipo;

        let valor = '';
        this.ComboOrigenes.forEach(function(elemento): void {
            if (elemento.cod === aux){
                valor = elemento.valor;
            }
        });

        this.filterBy = valor; // Filtro por parametro 
        this.onFilterChanged.next(this.filterBy);
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
     * _getComboOrigenes()
     * Encargado de consumir el servicio de combos para traer del backend los Origenes de Sucursales y Departamentos
     */
    private _getComboOrigenes(): void {
        if (this.ComboOrigenes.length !== 0) { return; }
        this.ComboOrigenes = this._combosService.getCombo('dep-suc');        
    }

    /**
     * Crea el llamado a los servicios de back
     * @param {string} user 
     */
    private _createRequest(url: string): Observable<any> | any {       
        const httpHeaders = new HttpHeaders({            
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };

        return this._httpClient.get(url, options);
    }

}
