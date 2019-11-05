import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Origen } from './origenes/origen.model';
import { ErrorService } from '../errors/error.service';
import { environment } from 'environments/environment';
import { LoginService } from '../authentication/login-2/login-2.service';
import { NotificacionSnackbarService } from '../common/notificacion.snackbar.service';

const API_URL: string = environment.API;

@Injectable()
export class OrigenesService implements Resolve<any>
{
    
    private searchText = '';
    origenes = [];
    onSearchTextChanged: Subject<any>;
    onOrigenesChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param { ErrorService } _errorService
     */
    constructor(
        private _httpClient: HttpClient,
        private _errorService: ErrorService,
        private _loginService: LoginService,
        private _notiSnackbarService: NotificacionSnackbarService
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
     * getOrigenes()
     * Encargado de traer del backend los origenes
     */
    getOrigenes(): Promise<any> {
        const url = API_URL + 'origenes';

        return new Promise((resolve, reject) => {
            this._createRequest(url)
                .subscribe(
                    (response: []) => {
                        if (response == null) {
                            response = [];
                        }

                        this.origenes = response;

                        this.origenes = this.origenes.map(o => {
                            return new Origen(o);
                        });

                        this.onOrigenesChanged.next(this.origenes);
                        resolve(this.origenes);

                    }, reject);
        });


    }

    updateOrigen(origen: Origen): void {

        console.log('entro');

        const httpHeaders = new HttpHeaders({
            'Authorization': this._loginService.getLocalToken()
        });

        // origen necesita tener esto: 
        // {
        // "codOrigen": "Admin",
        // "nombre": "Administracion Contable",
        // "codEmpresas": "1(FH)",
        // "tipo": "Equipo Departamento",
        // "legajoResp": "",
        // "legajoSup": "",
        // "observaciones": "prueba actualizar"
        // }

        const options = { headers: httpHeaders };

        const url = API_URL + 'origen?id=' + origen.idOrigen;

        this._httpClient.put(url, origen, options).subscribe(
            (res: any) => {
                ///////////////////////////////////////////////////////
                // Por el momento hasta que el response no traiga el codigo lo ejecuto 
                ///////////////////////////////////////////////////////
                console.log('respuesta del upOrigen ' + res);
                if (res == null) {
                    this.getOrigenes();
                } else {
                ///////////////////////////////////////////////////////

                    if (res.codigo === '1') {
                        this._notiSnackbarService.openSnackBar('Se Actualizo correctamente el Origen');
                        this.getOrigenes();
                    }
                    if (res.codigo === '0' || res.codigo === '-1') {
                        this._notiSnackbarService.openSnackBar('No se pudo Actualizar el Origen');
                    }

    ///////////////////////////////////////////////////////
                } // eliminar cuando se elimine el == null
    ///////////////////////////////////////////////////////
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

    /**
      * Realiza el llamado al backend mediante la url y token
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
