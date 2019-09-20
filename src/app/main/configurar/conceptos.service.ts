import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Concepto } from './conceptos/concepto.model';
import { ErrorService } from '../errors/error.service';
import { FuseUtils } from '@fuse/utils';
import { LoginService } from '../authentication/login-2/login-2.service';
import { environment } from 'environments/environment';
import { NotificacionSnackbarService } from '../common/notificacion.snackbar.service';

const API_URL: string = environment.API;

@Injectable()
export class ConceptosService implements Resolve<any>
{    
    
    conceptos = [];   

    private searchText = '';
    onSearchTextChanged: Subject<any>;
    onConceptosChanged: BehaviorSubject<any>;
    
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {ErrorService} _errorService
     */
    constructor(
        private _httpClient: HttpClient,
        private _errorService: ErrorService,
        private _loginService: LoginService,
        private _notiSnackbarService: NotificacionSnackbarService
    )
    {
        // Set the defaults        
        this.onConceptosChanged = new BehaviorSubject([]);
              
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
                this.getAllConceptos(),
            ]).then(
                ([files]) => {
                    
                    // Filtro por texto
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this._filterConceptos();
                    });                

                    resolve();

                },
                (error) => {                    
                    this.conceptos = [];

                    this.onConceptosChanged.next(this.conceptos);                    

                    this._errorService.errorHandler(error);
                    
                    resolve(this.conceptos);                    
                }
            );
        }); 
    }

    /**
     * getAllConceptos()
     * Encargado de traer del backend los conceptos
     */
    getAllConceptos(): any {
        const url = API_URL + 'conceptos';  

        return new Promise((resolve, reject) => {
            this._createRequest(url)
                .subscribe(
                    (response: Concepto[]) => {
                        if (response == null) {
                            response = [];
                        }

                        this.conceptos = response;

                        this.conceptos = this.conceptos.map(c => {
                            return new Concepto(c);
                        });

                        this.onConceptosChanged.next(this.conceptos);
                        resolve(this.conceptos);
                
                    }, reject);
        });
    }

    /**
     * updateConcepto()
     * Se encarga de enviar al backend un concepto para que sea actualizado
     * @param { Concepto } conc 
     */
    updateConcepto(conc: Concepto): void {
        const httpHeaders = new HttpHeaders({
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };

        const url = API_URL + 'concepto?id=' + conc.idConcepto;        

        this._httpClient.put(url, conc, options).subscribe(
            (res: any) => {
                ///////////////////////////////////////////////////////
                // Por el momento hasta que el response no traiga el codigo lo ejecuto 
                ///////////////////////////////////////////////////////
                console.log('respuesta del upConcepto ' + res);
                if (res == null) { 
                    this.getAllConceptos();
                } else {
                ///////////////////////////////////////////////////////
                
                    if (res.codigo === '1') {
                        this._notiSnackbarService.openSnackBar('Se Actualizo correctamente el Concepto');
                        this.getAllConceptos();
                    }
                    if (res.codigo === '0' || res.codigo === '-1') {
                        this._notiSnackbarService.openSnackBar('No se pudo Actualizar el Concepto');
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
     * _filterConceptos()
     * Dependiendo del texto ingresado filtra el contenido del objeto origenes
     */
    private _filterConceptos(): void {
        let aux = this.conceptos;
        if (this.searchText && this.searchText !== '') {
            aux = FuseUtils.filterArrayByString(this.conceptos, this.searchText);
        }

        this.onConceptosChanged.next(aux);
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
