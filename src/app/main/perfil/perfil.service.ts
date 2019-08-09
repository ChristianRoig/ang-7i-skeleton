import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorService } from '../errors/error.service';
import { LoginService } from '../authentication/login-2/login-2.service';
import { Perfil } from './perfil.model';
import { environment } from 'environments/environment';

const API_URL: string = environment.API;

@Injectable()
export class PerfilService implements Resolve<any>
{
    private info: Perfil;

    infoOnChanged: BehaviorSubject<any>;

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
    )
    {
        // Set the defaults
        this.infoOnChanged = new BehaviorSubject({});

    }

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
                this.getInfo(route.params.id),                
            ]).then(
                () => {
                    resolve();
                },
                (error) => {
                    this.info = new Perfil({});
                    this.infoOnChanged.next(this.info);

                    this._errorService.errorHandler(error, 'No se encontro la página para el perfil de ' + route.params.id);

                    resolve(this.info);  
                }
            );
        });
    }

    /**
     * Get info
     * @param {string} id
     */
    getInfo(id: string): Promise<any[]>
    {        
        return new Promise((resolve, reject) => {                
            this._llamadoHTTP(resolve, reject, id);       
        });
    }


    getTrue(): boolean {
        return true;
    }
    /**
     * llamadoHTTP realiza una corroboracion del usuario que se envia y hace el llamado correspondiente
     * @param resolve
     * @param reject
     * @param {string} user
     */
    private _llamadoHTTP(resolve, reject, user): void {

        if (!user){
            user = this.getUserLog();             
        }

        if (user === 'null' || user === '' || user === ' ') { // Fix en para inicio de sistema
            this.info = new Perfil({});
            this.infoOnChanged.next(this.info);
            resolve(this.info);
        }else {            
            this._createRequest(user)
                .subscribe((info: Perfil) => {

                    this.info = new Perfil(info);
                    this.infoOnChanged.next(this.info);
                    
                    resolve(this.info);

                }, reject);
        }  
    }

    /**
     * realiza el llamado al _loginService para traer el usuario que esta logueado
     * @returns {string}
     */
    getUserLog(): string{
        return this._loginService.getLocalUser();
    }

    /**
     * Crea el llamado al servicio back de obtenerColaboradorByLegajo
     * @param {string} user 
     */
    private _createRequest(user: string): Observable<any> | any {
        const httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json',
            'Authorization': this._loginService.getLocalToken()
        });

        const options = { headers: httpHeaders };

        const url = API_URL + 'obtenerColaboradorByLegajo';

        const params = {
            'legajo': user
        };

        return this._httpClient.post(url, params, options);

    }

}
